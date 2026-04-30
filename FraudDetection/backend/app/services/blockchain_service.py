import os
import logging
from typing import Any, Dict, List

from dotenv import load_dotenv
from web3 import Web3

load_dotenv()
logger = logging.getLogger(__name__)


class BlockchainService:
    def __init__(self) -> None:
        self.rpc_url = os.getenv("POLYGON_RPC_URL")
        self.rpc_urls = self._load_rpc_urls()
        self.contract_address = os.getenv("CONTRACT_ADDRESS")
        self.private_key = os.getenv("PRIVATE_KEY")
        self._abi = [
            {
                "inputs": [
                    {"internalType": "string", "name": "_id", "type": "string"},
                    {"internalType": "string", "name": "_hash", "type": "string"},
                ],
                "name": "anchorHash",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function",
            },
            {
                "inputs": [{"internalType": "string", "name": "_id", "type": "string"}],
                "name": "getHash",
                "outputs": [{"internalType": "string", "name": "", "type": "string"}],
                "stateMutability": "view",
                "type": "function",
            },
        ]

        self.w3 = None
        self.account = None
        self.contract = None
        self.active_rpc_url = None
        self._initialize()

    def _load_rpc_urls(self) -> List[str]:
        urls: List[str] = []
        csv_urls = os.getenv("POLYGON_RPC_URLS", "")
        if csv_urls:
            urls.extend([u.strip() for u in csv_urls.split(",") if u.strip()])
        if self.rpc_url and self.rpc_url not in urls:
            urls.insert(0, self.rpc_url)
        return urls

    def _init_web3(self, rpc_url: str) -> bool:
        try:
            w3 = Web3(Web3.HTTPProvider(rpc_url))
            account = w3.eth.account.from_key(self.private_key)
            contract = w3.eth.contract(address=self.contract_address, abi=self._abi)

            # Lightweight connectivity check before marking this provider active.
            _ = w3.eth.chain_id

            self.w3 = w3
            self.account = account
            self.contract = contract
            self.active_rpc_url = rpc_url
            logger.info("[CHAIN] Using RPC endpoint %s", rpc_url)
            return True
        except Exception:
            logger.exception("[CHAIN] Failed to initialize RPC endpoint %s", rpc_url)
            return False

    def _initialize(self) -> None:
        if not self.rpc_urls or not self.contract_address or not self.private_key:
            logger.warning("[CHAIN] Missing blockchain env vars. Anchoring disabled.")
            return

        for rpc_url in self.rpc_urls:
            if self._init_web3(rpc_url):
                logger.info("[CHAIN] Blockchain service initialized address=%s", self.account.address)
                return

        logger.error("[CHAIN] No healthy RPC endpoint available. Anchoring disabled.")

    def is_ready(self) -> bool:
        return self.w3 is not None and self.account is not None and self.contract is not None

    def anchor_report(self, report_id: str, report_hash: str) -> Dict[str, Any]:
        if not self.rpc_urls:
            logger.error("[CHAIN] Anchor skipped. No RPC URLs configured report_id=%s", report_id)
            return {
                "success": False,
                "error": "Blockchain is not configured. Set POLYGON_RPC_URL (or POLYGON_RPC_URLS), CONTRACT_ADDRESS and PRIVATE_KEY.",
            }

        last_error = "unknown error"
        tried_urls: List[str] = []

        for rpc_url in self.rpc_urls:
            tried_urls.append(rpc_url)
            if not self._init_web3(rpc_url):
                continue

            for attempt in range(1, 3):
                try:
                    logger.info(
                        "[CHAIN] Anchor request report_id=%s rpc=%s attempt=%s",
                        report_id,
                        rpc_url,
                        attempt,
                    )
                    nonce = self.w3.eth.get_transaction_count(self.account.address)

                    tx = self.contract.functions.anchorHash(report_id, report_hash).build_transaction(
                        {
                            "from": self.account.address,
                            "nonce": nonce,
                            "gas": 100000,
                            "gasPrice": self.w3.eth.gas_price,
                            "chainId": self.w3.eth.chain_id,
                        }
                    )

                    signed_tx = self.w3.eth.account.sign_transaction(tx, self.private_key)
                    tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)

                    tx_hash_hex = self.w3.to_hex(tx_hash)
                    logger.info(
                        "[CHAIN] Anchor success report_id=%s tx_hash=%s rpc=%s",
                        report_id,
                        tx_hash_hex,
                        rpc_url,
                    )

                    return {
                        "success": True,
                        "status": "Anchored",
                        "tx_hash": tx_hash_hex,
                        "rpc_url": rpc_url,
                    }
                except Exception as exc:
                    last_error = str(exc)
                    logger.exception(
                        "[CHAIN] Anchor failed report_id=%s rpc=%s attempt=%s",
                        report_id,
                        rpc_url,
                        attempt,
                    )

        return {
            "success": False,
            "error": last_error,
            "tried_rpc_urls": tried_urls,
        }

    def get_report_hash(self, report_id: str) -> Dict[str, Any]:
        if not self.rpc_urls:
            logger.error("[CHAIN] Verify skipped. No RPC URLs configured report_id=%s", report_id)
            return {
                "success": False,
                "error": "Blockchain is not configured. Set POLYGON_RPC_URL (or POLYGON_RPC_URLS), CONTRACT_ADDRESS and PRIVATE_KEY.",
            }

        last_error = "unknown error"
        tried_urls: List[str] = []

        for rpc_url in self.rpc_urls:
            tried_urls.append(rpc_url)
            if not self._init_web3(rpc_url):
                continue

            try:
                logger.info("[CHAIN] Read hash request report_id=%s rpc=%s", report_id, rpc_url)
                chain_hash = self.contract.functions.getHash(report_id).call()

                if not chain_hash:
                    return {
                        "success": False,
                        "error": "No hash found on blockchain for this report.",
                        "rpc_url": rpc_url,
                    }

                return {
                    "success": True,
                    "hash": chain_hash,
                    "rpc_url": rpc_url,
                }
            except Exception as exc:
                last_error = str(exc)
                logger.exception("[CHAIN] Read hash failed report_id=%s rpc=%s", report_id, rpc_url)

        return {
            "success": False,
            "error": last_error,
            "tried_rpc_urls": tried_urls,
        }


blockchain_service = BlockchainService()

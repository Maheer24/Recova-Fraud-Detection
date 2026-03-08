import pandas as pd

def preprocess_input_data(df):
    #check if required columns are present
    required_columns = ['Avg min between sent tnx', 'Avg min between received tnx',
                            'Time Diff between first and last (Mins)', 'Sent tnx', 'Received Tnx',
                            'Number of Created Contracts', 'Unique Received From Addresses',
                            'Unique Sent To Addresses', 'min value received', 'max value received',
                            'avg val received', 'min val sent', 'max val sent', 'avg val sent',
                            'min value sent to contract', 'total Ether sent', 'total ether balance',
                            'Total ERC20 tnxs', 'ERC20 total Ether received',
                            'ERC20 total Ether sent contract', 'ERC20 max val sent']
        
    if not all(col in df.columns for col in required_columns):
        raise ValueError("Required columns missing")
    
    df = df[required_columns]

    # Impute missing values with median
    df = df.fillna(df.median())

    return df



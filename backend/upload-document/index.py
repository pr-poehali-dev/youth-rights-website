import json
import os
import base64
import boto3
import uuid

def handler(event: dict, context) -> dict:
    """Загрузка документа в S3 с публичным доступом"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    raw_body = event.get('body') or ''
    body = json.loads(raw_body) if raw_body else {}
    filename = body.get('filename', '')
    file_data_b64 = body.get('fileData', '')
    content_type = body.get('contentType', 'application/octet-stream')

    if not filename or not file_data_b64:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'filename and fileData are required'})
        }

    file_bytes = base64.b64decode(file_data_b64)
    safe_name = filename.replace(' ', '_')
    unique_key = f"documents/{uuid.uuid4().hex[:8]}_{safe_name}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    s3.put_object(
        Bucket='files',
        Key=unique_key,
        Body=file_bytes,
        ContentType=content_type,
        ContentDisposition=f'attachment; filename="{safe_name}"',
        ACL='public-read'
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{unique_key}"

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'url': cdn_url, 'key': unique_key})
    }

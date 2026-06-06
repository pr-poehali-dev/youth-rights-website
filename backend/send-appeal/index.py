import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

RECIPIENT_EMAIL = "polimick@rambler.ru"

def handler(event: dict, context) -> dict:
    """Отправка обращения на почту уполномоченного"""

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

    last_name = body.get('lastName', '')
    first_name = body.get('firstName', '')
    middle_name = body.get('middleName', '')
    birth_date = body.get('birthDate', '')
    phone = body.get('phone', '')
    email = body.get('email', '')
    message = body.get('message', '')

    if not all([last_name, first_name, phone, email, message]):
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Required fields missing'})
        }

    full_name = ' '.join(filter(None, [last_name, first_name, middle_name]))

    smtp_host = os.environ.get('SMTP_HOST', 'smtp.rambler.ru')
    smtp_port = int(os.environ.get('SMTP_PORT', '465'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASS', '')

    html_body = f"""
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
  <div style="background: #1a56db; padding: 20px 30px;">
    <h2 style="color: white; margin: 0; font-size: 18px;">Новое обращение на сайте</h2>
  </div>
  <div style="padding: 30px; background: #f8fafc; border: 1px solid #e2e8f0;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; font-size: 13px; color: #64748b; width: 160px;">ФИО</td>
        <td style="padding: 10px 0; font-size: 14px; font-weight: 600;">{full_name}</td>
      </tr>
      <tr style="border-top: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-size: 13px; color: #64748b;">Дата рождения</td>
        <td style="padding: 10px 0; font-size: 14px;">{birth_date}</td>
      </tr>
      <tr style="border-top: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-size: 13px; color: #64748b;">Телефон</td>
        <td style="padding: 10px 0; font-size: 14px;">{phone}</td>
      </tr>
      <tr style="border-top: 1px solid #e2e8f0;">
        <td style="padding: 10px 0; font-size: 13px; color: #64748b;">Email</td>
        <td style="padding: 10px 0; font-size: 14px;">{email}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; padding: 16px; background: white; border-left: 3px solid #1a56db; border-radius: 0 4px 4px 0;">
      <p style="font-size: 13px; color: #64748b; margin: 0 0 8px 0;">Суть обращения:</p>
      <p style="font-size: 14px; margin: 0; line-height: 1.6;">{message}</p>
    </div>
  </div>
  <div style="padding: 16px 30px; background: #e8f0fe; font-size: 12px; color: #64748b;">
    Обращение получено с сайта Уполномоченного по правам молодёжи
  </div>
</body>
</html>
"""

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новое обращение: {full_name}'
    msg['From'] = smtp_user
    msg['To'] = RECIPIENT_EMAIL
    msg['Reply-To'] = email
    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, RECIPIENT_EMAIL, msg.as_string())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }

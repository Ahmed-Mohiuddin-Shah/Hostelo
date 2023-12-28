import smtplib
from email.message import EmailMessage
from decouple import config # type: ignore

class EmailServer:
    def __init__(self, email_name: str, email_password: str):
        self.mailServer = smtplib.SMTP('smtp.gmail.com', 587)
        self.mailServer.ehlo()
        self.mailServer.starttls()
        self.mailServer.ehlo()
        self.mailServer.login(email_name, email_password)

    def makeLoginDetailsEmailMessage(self, to: str, username: str, password: str) -> EmailMessage:
        msg = EmailMessage()
        msg['Subject'] = '🚪 Your Hostelo Sign-In Info Is Here! 🎉'
        msg['From'] = "hostelo275@gmail.com"
        msg['To'] = to
        msg.set_content(f"Hey there!\n\nWelcome to Hostelo! 😎 Below are your sign-in deets:\n\n👤 Username: {username}\n🔒 Password: {password}\n\nNow you are all set. 🏨✨\n\nIf you have any questions or need assistance, just give us a shout at hostelo275@gmail.com. Happy stays! 🚀\n\nBest regards,\nAhmed Mohiuddin Shah\nThe Hostelo Team")
        return msg


    def sendEmail(self, msg: EmailMessage) -> None:
        self.mailServer.send_message(msg)

    def closeEmailServer(self) -> None:
        self.mailServer.close()

mailServer = EmailServer(email_name=config("email_name"), email_password=config("email_password")) #type: ignore
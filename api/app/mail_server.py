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
        msg['From'] = config("email_name")
        msg['To'] = to
        msg.set_content(f"Hey there!\n\nWelcome to Hostelo! 😎 Below are your sign-in deets:\n\n👤 Username: {username}\n🔒 Password: {password}\n\nNow you are all set. 🏨✨\n\nIf you have any questions or need assistance, just give us a shout at hostelo275@gmail.com. Stay Happy! 🚀\n\nBest regards,\nAhmed Mohiuddin Shah\nThe Hostelo Team")
        return msg
    
    def makeMessInvoiceEmailMessage(self, to: str, studentID: str, invoiceDate: str, invoiceID: int, studentName: str, daysOff: str, totalCost: str, managerName: str, role: str) -> EmailMessage:
        msg = EmailMessage()
        msg['Subject'] = '🧾 Your Hostelo Mess Invoice Is Here! 🎉'
        msg['From'] = config("email_name")
        msg['To'] = to
        msg.set_content(f"Hey there {studentName}!\n\nYour Hostelo mess invoice for {invoiceDate} is here! 🧾\n\n🧾 Invoice ID: {invoiceID} \n👤 Student ID: {studentID}\n📅 Days Off: {daysOff}\n💰 Total Cost: {totalCost}\n\nIf you have any questions or need assistance, just give us a shout at hostelo275@gmail.com. Stay Happy! 🚀\n\nBest regards,\n{managerName}\n{role}")
        return msg

    def sendEmail(self, msg: EmailMessage) -> None:
        self.mailServer.send_message(msg)

    def closeEmailServer(self) -> None:
        self.mailServer.close()

mailServer = EmailServer(email_name=config("email_name"), email_password=config("email_password")) #type: ignore
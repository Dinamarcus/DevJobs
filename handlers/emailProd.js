import SibApiV3Sdk from 'sib-api-v3-sdk';

const enviarEmail = async (opciones) => {
    var defaultClient = SibApiV3Sdk.ApiClient.instance;

    let apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;

    var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = opciones.asunto;
    sendSmtpEmail.htmlContent = opciones.html;
    sendSmtpEmail.sender = { "name": opciones.remitente.name, "email": opciones.remitente.email };
    sendSmtpEmail.to = [
    { "email": opciones.destinatario.email, "name": opciones.destinatario.name }
    ];
    sendSmtpEmail.replyTo = { "email": opciones.remitente.email, "name": opciones.remitente.name };

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
        console.log('API called successfully. Returned data: ' + data);
      }, function(error) {
        console.error(error);
      });
};

export default enviarEmail;
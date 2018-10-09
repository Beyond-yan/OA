package cn.com.hnisi.egs.app.sms.client;

public class SmsServiceProxy implements cn.com.hnisi.egs.app.sms.client.SmsService {
  private String _endpoint = null;
  private cn.com.hnisi.egs.app.sms.client.SmsService smsService = null;
  
  public SmsServiceProxy() {
    _initSmsServiceProxy();
  }
  
  public SmsServiceProxy(String endpoint) {
    _endpoint = endpoint;
    _initSmsServiceProxy();
  }
  
  private void _initSmsServiceProxy() {
    try {
      smsService = (new cn.com.hnisi.egs.app.sms.client.SmsServiceServiceLocator()).getSmsService();
      if (smsService != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)smsService)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)smsService)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (smsService != null)
      ((javax.xml.rpc.Stub)smsService)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public cn.com.hnisi.egs.app.sms.client.SmsService getSmsService() {
    if (smsService == null)
      _initSmsServiceProxy();
    return smsService;
  }
  
  public cn.com.hnisi.egs.app.sms.client.model.RespInfo auth(java.lang.String spid, java.lang.String passwd) throws java.rmi.RemoteException{
    if (smsService == null)
      _initSmsServiceProxy();
    return smsService.auth(spid, passwd);
  }
  
  public cn.com.hnisi.egs.app.sms.client.model.RespInfo terminate(java.lang.String passport) throws java.rmi.RemoteException{
    if (smsService == null)
      _initSmsServiceProxy();
    return smsService.terminate(passport);
  }
  
  public cn.com.hnisi.egs.app.sms.client.model.RespInfo sendSms(java.lang.String passport, java.lang.String sequenceId, java.lang.String srcId, java.lang.String[] receiverList, java.lang.String content, java.lang.String sendtime, boolean reportFlag) throws java.rmi.RemoteException{
    if (smsService == null)
      _initSmsServiceProxy();
    return smsService.sendSms(passport, sequenceId, srcId, receiverList, content, sendtime, reportFlag);
  }
  
  public cn.com.hnisi.egs.app.sms.client.model.RespInfo sendActive(java.lang.String passport) throws java.rmi.RemoteException{
    if (smsService == null)
      _initSmsServiceProxy();
    return smsService.sendActive(passport);
  }
  
  public cn.com.hnisi.egs.app.sms.client.model.DeliverMsg[] getDeliver(java.lang.String passport) throws java.rmi.RemoteException{
    if (smsService == null)
      _initSmsServiceProxy();
    return smsService.getDeliver(passport);
  }
  
  public cn.com.hnisi.egs.app.sms.client.model.SendRespMsg[] getSendResp(java.lang.String passport) throws java.rmi.RemoteException{
    if (smsService == null)
      _initSmsServiceProxy();
    return smsService.getSendResp(passport);
  }
  
  
}
package cn.com.hnisi.egs.app.sms;

public class HnisiSmsServiceProxy implements cn.com.hnisi.egs.app.sms.HnisiSmsService {
  private String _endpoint = null;
  private cn.com.hnisi.egs.app.sms.HnisiSmsService hnisiSmsService = null;
  
  public HnisiSmsServiceProxy() {
    _initHnisiSmsServiceProxy();
  }
  
  public HnisiSmsServiceProxy(String endpoint) {
    _endpoint = endpoint;
    _initHnisiSmsServiceProxy();
  }
  
  private void _initHnisiSmsServiceProxy() {
    try {
      hnisiSmsService = (new cn.com.hnisi.egs.app.sms.HnisiSmsServiceServiceLocator()).getHnisiSmsService();
      if (hnisiSmsService != null) {
        if (_endpoint != null)
          ((javax.xml.rpc.Stub)hnisiSmsService)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
        else
          _endpoint = (String)((javax.xml.rpc.Stub)hnisiSmsService)._getProperty("javax.xml.rpc.service.endpoint.address");
      }
      
    }
    catch (javax.xml.rpc.ServiceException serviceException) {}
  }
  
  public String getEndpoint() {
    return _endpoint;
  }
  
  public void setEndpoint(String endpoint) {
    _endpoint = endpoint;
    if (hnisiSmsService != null)
      ((javax.xml.rpc.Stub)hnisiSmsService)._setProperty("javax.xml.rpc.service.endpoint.address", _endpoint);
    
  }
  
  public cn.com.hnisi.egs.app.sms.HnisiSmsService getHnisiSmsService() {
    if (hnisiSmsService == null)
      _initHnisiSmsServiceProxy();
    return hnisiSmsService;
  }
  
  public java.lang.String sendSms(java.lang.String phone, java.lang.String msg, java.util.Calendar time, int priority, java.lang.String orgCode) throws java.rmi.RemoteException{
    if (hnisiSmsService == null)
      _initHnisiSmsServiceProxy();
    return hnisiSmsService.sendSms(phone, msg, time, priority, orgCode);
  }
  
  public cn.com.hnisi.egs.app.sms.SmsMessage[] notifySmsReception(java.lang.String orgCode, java.lang.String extendCode) throws java.rmi.RemoteException{
    if (hnisiSmsService == null)
      _initHnisiSmsServiceProxy();
    return hnisiSmsService.notifySmsReception(orgCode, extendCode);
  }
  
  
}
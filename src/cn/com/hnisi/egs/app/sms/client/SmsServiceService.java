/**
 * SmsServiceService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms.client;

public interface SmsServiceService extends javax.xml.rpc.Service {
    public java.lang.String getSmsServiceAddress();

    public cn.com.hnisi.egs.app.sms.client.SmsService getSmsService() throws javax.xml.rpc.ServiceException;

    public cn.com.hnisi.egs.app.sms.client.SmsService getSmsService(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}

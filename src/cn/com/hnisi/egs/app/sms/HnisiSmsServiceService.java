/**
 * HnisiSmsServiceService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms;

public interface HnisiSmsServiceService extends javax.xml.rpc.Service {
    public java.lang.String getHnisiSmsServiceAddress();

    public cn.com.hnisi.egs.app.sms.HnisiSmsService getHnisiSmsService() throws javax.xml.rpc.ServiceException;

    public cn.com.hnisi.egs.app.sms.HnisiSmsService getHnisiSmsService(java.net.URL portAddress) throws javax.xml.rpc.ServiceException;
}

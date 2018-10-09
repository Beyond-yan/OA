/**
 * HnisiSmsService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms;

public interface HnisiSmsService extends java.rmi.Remote {
    public java.lang.String sendSms(java.lang.String phone, java.lang.String msg, java.util.Calendar time, int priority, java.lang.String orgCode) throws java.rmi.RemoteException;
    public cn.com.hnisi.egs.app.sms.SmsMessage[] notifySmsReception(java.lang.String orgCode, java.lang.String extendCode) throws java.rmi.RemoteException;
}

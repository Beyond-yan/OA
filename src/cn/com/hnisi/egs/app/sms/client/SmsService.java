/**
 * SmsService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms.client;

public interface SmsService extends java.rmi.Remote {
    public cn.com.hnisi.egs.app.sms.client.model.RespInfo auth(java.lang.String spid, java.lang.String passwd) throws java.rmi.RemoteException;
    public cn.com.hnisi.egs.app.sms.client.model.RespInfo terminate(java.lang.String passport) throws java.rmi.RemoteException;
    public cn.com.hnisi.egs.app.sms.client.model.RespInfo sendSms(java.lang.String passport, java.lang.String sequenceId, java.lang.String srcId, java.lang.String[] receiverList, java.lang.String content, java.lang.String sendtime, boolean reportFlag) throws java.rmi.RemoteException;
    public cn.com.hnisi.egs.app.sms.client.model.RespInfo sendActive(java.lang.String passport) throws java.rmi.RemoteException;
    public cn.com.hnisi.egs.app.sms.client.model.DeliverMsg[] getDeliver(java.lang.String passport) throws java.rmi.RemoteException;
    public cn.com.hnisi.egs.app.sms.client.model.SendRespMsg[] getSendResp(java.lang.String passport) throws java.rmi.RemoteException;
}

/**
 * HnisiSmsServiceServiceLocator.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms;

public class HnisiSmsServiceServiceLocator extends org.apache.axis.client.Service implements cn.com.hnisi.egs.app.sms.HnisiSmsServiceService {

    public HnisiSmsServiceServiceLocator() {
    }


    public HnisiSmsServiceServiceLocator(org.apache.axis.EngineConfiguration config) {
        super(config);
    }

    public HnisiSmsServiceServiceLocator(java.lang.String wsdlLoc, javax.xml.namespace.QName sName) throws javax.xml.rpc.ServiceException {
        super(wsdlLoc, sName);
    }

    // Use to get a proxy class for HnisiSmsService
    private java.lang.String HnisiSmsService_address = "http://10.224.6.21:8899/cq96096/services/HnisiSmsService";

    public java.lang.String getHnisiSmsServiceAddress() {
        return HnisiSmsService_address;
    }

    // The WSDD service name defaults to the port name.
    private java.lang.String HnisiSmsServiceWSDDServiceName = "HnisiSmsService";

    public java.lang.String getHnisiSmsServiceWSDDServiceName() {
        return HnisiSmsServiceWSDDServiceName;
    }

    public void setHnisiSmsServiceWSDDServiceName(java.lang.String name) {
        HnisiSmsServiceWSDDServiceName = name;
    }

    public cn.com.hnisi.egs.app.sms.HnisiSmsService getHnisiSmsService() throws javax.xml.rpc.ServiceException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(HnisiSmsService_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new javax.xml.rpc.ServiceException(e);
        }
        return getHnisiSmsService(endpoint);
    }

    public cn.com.hnisi.egs.app.sms.HnisiSmsService getHnisiSmsService(java.net.URL portAddress) throws javax.xml.rpc.ServiceException {
        try {
            cn.com.hnisi.egs.app.sms.HnisiSmsServiceSoapBindingStub _stub = new cn.com.hnisi.egs.app.sms.HnisiSmsServiceSoapBindingStub(portAddress, this);
            _stub.setPortName(getHnisiSmsServiceWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            return null;
        }
    }

    public void setHnisiSmsServiceEndpointAddress(java.lang.String address) {
        HnisiSmsService_address = address;
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        try {
            if (cn.com.hnisi.egs.app.sms.HnisiSmsService.class.isAssignableFrom(serviceEndpointInterface)) {
                cn.com.hnisi.egs.app.sms.HnisiSmsServiceSoapBindingStub _stub = new cn.com.hnisi.egs.app.sms.HnisiSmsServiceSoapBindingStub(new java.net.URL(HnisiSmsService_address), this);
                _stub.setPortName(getHnisiSmsServiceWSDDServiceName());
                return _stub;
            }
        }
        catch (java.lang.Throwable t) {
            throw new javax.xml.rpc.ServiceException(t);
        }
        throw new javax.xml.rpc.ServiceException("There is no stub implementation for the interface:  " + (serviceEndpointInterface == null ? "null" : serviceEndpointInterface.getName()));
    }

    /**
     * For the given interface, get the stub implementation.
     * If this service has no port for the given interface,
     * then ServiceException is thrown.
     */
    public java.rmi.Remote getPort(javax.xml.namespace.QName portName, Class serviceEndpointInterface) throws javax.xml.rpc.ServiceException {
        if (portName == null) {
            return getPort(serviceEndpointInterface);
        }
        java.lang.String inputPortName = portName.getLocalPart();
        if ("HnisiSmsService".equals(inputPortName)) {
            return getHnisiSmsService();
        }
        else  {
            java.rmi.Remote _stub = getPort(serviceEndpointInterface);
            ((org.apache.axis.client.Stub) _stub).setPortName(portName);
            return _stub;
        }
    }

    public javax.xml.namespace.QName getServiceName() {
        return new javax.xml.namespace.QName("http://sms.app.egs.hnisi.com.cn", "HnisiSmsServiceService");
    }

    private java.util.HashSet ports = null;

    public java.util.Iterator getPorts() {
        if (ports == null) {
            ports = new java.util.HashSet();
            ports.add(new javax.xml.namespace.QName("http://sms.app.egs.hnisi.com.cn", "HnisiSmsService"));
        }
        return ports.iterator();
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(java.lang.String portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        
if ("HnisiSmsService".equals(portName)) {
            setHnisiSmsServiceEndpointAddress(address);
        }
        else 
{ // Unknown Port Name
            throw new javax.xml.rpc.ServiceException(" Cannot set Endpoint Address for Unknown Port" + portName);
        }
    }

    /**
    * Set the endpoint address for the specified port name.
    */
    public void setEndpointAddress(javax.xml.namespace.QName portName, java.lang.String address) throws javax.xml.rpc.ServiceException {
        setEndpointAddress(portName.getLocalPart(), address);
    }

}

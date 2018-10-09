/**
 * RespInfo.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms.client.model;

public class RespInfo  implements java.io.Serializable {
    private int respCode;

    private java.lang.String respMessage;

    public RespInfo() {
    }

    public RespInfo(
           int respCode,
           java.lang.String respMessage) {
           this.respCode = respCode;
           this.respMessage = respMessage;
    }


    /**
     * Gets the respCode value for this RespInfo.
     * 
     * @return respCode
     */
    public int getRespCode() {
        return respCode;
    }


    /**
     * Sets the respCode value for this RespInfo.
     * 
     * @param respCode
     */
    public void setRespCode(int respCode) {
        this.respCode = respCode;
    }


    /**
     * Gets the respMessage value for this RespInfo.
     * 
     * @return respMessage
     */
    public java.lang.String getRespMessage() {
        return respMessage;
    }


    /**
     * Sets the respMessage value for this RespInfo.
     * 
     * @param respMessage
     */
    public void setRespMessage(java.lang.String respMessage) {
        this.respMessage = respMessage;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof RespInfo)) return false;
        RespInfo other = (RespInfo) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            this.respCode == other.getRespCode() &&
            ((this.respMessage==null && other.getRespMessage()==null) || 
             (this.respMessage!=null &&
              this.respMessage.equals(other.getRespMessage())));
        __equalsCalc = null;
        return _equals;
    }

    private boolean __hashCodeCalc = false;
    public synchronized int hashCode() {
        if (__hashCodeCalc) {
            return 0;
        }
        __hashCodeCalc = true;
        int _hashCode = 1;
        _hashCode += getRespCode();
        if (getRespMessage() != null) {
            _hashCode += getRespMessage().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(RespInfo.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "RespInfo"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("respCode");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "respCode"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("respMessage");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "respMessage"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
    }

    /**
     * Return type metadata object
     */
    public static org.apache.axis.description.TypeDesc getTypeDesc() {
        return typeDesc;
    }

    /**
     * Get Custom Serializer
     */
    public static org.apache.axis.encoding.Serializer getSerializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanSerializer(
            _javaType, _xmlType, typeDesc);
    }

    /**
     * Get Custom Deserializer
     */
    public static org.apache.axis.encoding.Deserializer getDeserializer(
           java.lang.String mechType, 
           java.lang.Class _javaType,  
           javax.xml.namespace.QName _xmlType) {
        return 
          new  org.apache.axis.encoding.ser.BeanDeserializer(
            _javaType, _xmlType, typeDesc);
    }

}

/**
 * DeliverMsg.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms.client.model;

public class DeliverMsg  implements java.io.Serializable {
    private java.lang.String content;

    private java.lang.String destId;

    private java.lang.String hd;

    private java.lang.Long msgid;

    private java.lang.String msisdn;

    private java.lang.String status;

    private java.lang.String time;

    public DeliverMsg() {
    }

    public DeliverMsg(
           java.lang.String content,
           java.lang.String destId,
           java.lang.String hd,
           java.lang.Long msgid,
           java.lang.String msisdn,
           java.lang.String status,
           java.lang.String time) {
           this.content = content;
           this.destId = destId;
           this.hd = hd;
           this.msgid = msgid;
           this.msisdn = msisdn;
           this.status = status;
           this.time = time;
    }


    /**
     * Gets the content value for this DeliverMsg.
     * 
     * @return content
     */
    public java.lang.String getContent() {
        return content;
    }


    /**
     * Sets the content value for this DeliverMsg.
     * 
     * @param content
     */
    public void setContent(java.lang.String content) {
        this.content = content;
    }


    /**
     * Gets the destId value for this DeliverMsg.
     * 
     * @return destId
     */
    public java.lang.String getDestId() {
        return destId;
    }


    /**
     * Sets the destId value for this DeliverMsg.
     * 
     * @param destId
     */
    public void setDestId(java.lang.String destId) {
        this.destId = destId;
    }


    /**
     * Gets the hd value for this DeliverMsg.
     * 
     * @return hd
     */
    public java.lang.String getHd() {
        return hd;
    }


    /**
     * Sets the hd value for this DeliverMsg.
     * 
     * @param hd
     */
    public void setHd(java.lang.String hd) {
        this.hd = hd;
    }


    /**
     * Gets the msgid value for this DeliverMsg.
     * 
     * @return msgid
     */
    public java.lang.Long getMsgid() {
        return msgid;
    }


    /**
     * Sets the msgid value for this DeliverMsg.
     * 
     * @param msgid
     */
    public void setMsgid(java.lang.Long msgid) {
        this.msgid = msgid;
    }


    /**
     * Gets the msisdn value for this DeliverMsg.
     * 
     * @return msisdn
     */
    public java.lang.String getMsisdn() {
        return msisdn;
    }


    /**
     * Sets the msisdn value for this DeliverMsg.
     * 
     * @param msisdn
     */
    public void setMsisdn(java.lang.String msisdn) {
        this.msisdn = msisdn;
    }


    /**
     * Gets the status value for this DeliverMsg.
     * 
     * @return status
     */
    public java.lang.String getStatus() {
        return status;
    }


    /**
     * Sets the status value for this DeliverMsg.
     * 
     * @param status
     */
    public void setStatus(java.lang.String status) {
        this.status = status;
    }


    /**
     * Gets the time value for this DeliverMsg.
     * 
     * @return time
     */
    public java.lang.String getTime() {
        return time;
    }


    /**
     * Sets the time value for this DeliverMsg.
     * 
     * @param time
     */
    public void setTime(java.lang.String time) {
        this.time = time;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof DeliverMsg)) return false;
        DeliverMsg other = (DeliverMsg) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.content==null && other.getContent()==null) || 
             (this.content!=null &&
              this.content.equals(other.getContent()))) &&
            ((this.destId==null && other.getDestId()==null) || 
             (this.destId!=null &&
              this.destId.equals(other.getDestId()))) &&
            ((this.hd==null && other.getHd()==null) || 
             (this.hd!=null &&
              this.hd.equals(other.getHd()))) &&
            ((this.msgid==null && other.getMsgid()==null) || 
             (this.msgid!=null &&
              this.msgid.equals(other.getMsgid()))) &&
            ((this.msisdn==null && other.getMsisdn()==null) || 
             (this.msisdn!=null &&
              this.msisdn.equals(other.getMsisdn()))) &&
            ((this.status==null && other.getStatus()==null) || 
             (this.status!=null &&
              this.status.equals(other.getStatus()))) &&
            ((this.time==null && other.getTime()==null) || 
             (this.time!=null &&
              this.time.equals(other.getTime())));
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
        if (getContent() != null) {
            _hashCode += getContent().hashCode();
        }
        if (getDestId() != null) {
            _hashCode += getDestId().hashCode();
        }
        if (getHd() != null) {
            _hashCode += getHd().hashCode();
        }
        if (getMsgid() != null) {
            _hashCode += getMsgid().hashCode();
        }
        if (getMsisdn() != null) {
            _hashCode += getMsisdn().hashCode();
        }
        if (getStatus() != null) {
            _hashCode += getStatus().hashCode();
        }
        if (getTime() != null) {
            _hashCode += getTime().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(DeliverMsg.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "DeliverMsg"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("content");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "content"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("destId");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "destId"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("hd");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "hd"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("msgid");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "msgid"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "long"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("msisdn");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "msisdn"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("status");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "status"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("time");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "time"));
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

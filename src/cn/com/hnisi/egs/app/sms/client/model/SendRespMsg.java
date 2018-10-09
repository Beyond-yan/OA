/**
 * SendRespMsg.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cn.com.hnisi.egs.app.sms.client.model;

public class SendRespMsg  implements java.io.Serializable {
    private java.lang.String hd;

    private java.lang.Long msgid;

    private java.lang.String msisdn;

    private int nums;

    private java.lang.String result;

    private java.lang.String sequenceid;

    public SendRespMsg() {
    }

    public SendRespMsg(
           java.lang.String hd,
           java.lang.Long msgid,
           java.lang.String msisdn,
           int nums,
           java.lang.String result,
           java.lang.String sequenceid) {
           this.hd = hd;
           this.msgid = msgid;
           this.msisdn = msisdn;
           this.nums = nums;
           this.result = result;
           this.sequenceid = sequenceid;
    }


    /**
     * Gets the hd value for this SendRespMsg.
     * 
     * @return hd
     */
    public java.lang.String getHd() {
        return hd;
    }


    /**
     * Sets the hd value for this SendRespMsg.
     * 
     * @param hd
     */
    public void setHd(java.lang.String hd) {
        this.hd = hd;
    }


    /**
     * Gets the msgid value for this SendRespMsg.
     * 
     * @return msgid
     */
    public java.lang.Long getMsgid() {
        return msgid;
    }


    /**
     * Sets the msgid value for this SendRespMsg.
     * 
     * @param msgid
     */
    public void setMsgid(java.lang.Long msgid) {
        this.msgid = msgid;
    }


    /**
     * Gets the msisdn value for this SendRespMsg.
     * 
     * @return msisdn
     */
    public java.lang.String getMsisdn() {
        return msisdn;
    }


    /**
     * Sets the msisdn value for this SendRespMsg.
     * 
     * @param msisdn
     */
    public void setMsisdn(java.lang.String msisdn) {
        this.msisdn = msisdn;
    }


    /**
     * Gets the nums value for this SendRespMsg.
     * 
     * @return nums
     */
    public int getNums() {
        return nums;
    }


    /**
     * Sets the nums value for this SendRespMsg.
     * 
     * @param nums
     */
    public void setNums(int nums) {
        this.nums = nums;
    }


    /**
     * Gets the result value for this SendRespMsg.
     * 
     * @return result
     */
    public java.lang.String getResult() {
        return result;
    }


    /**
     * Sets the result value for this SendRespMsg.
     * 
     * @param result
     */
    public void setResult(java.lang.String result) {
        this.result = result;
    }


    /**
     * Gets the sequenceid value for this SendRespMsg.
     * 
     * @return sequenceid
     */
    public java.lang.String getSequenceid() {
        return sequenceid;
    }


    /**
     * Sets the sequenceid value for this SendRespMsg.
     * 
     * @param sequenceid
     */
    public void setSequenceid(java.lang.String sequenceid) {
        this.sequenceid = sequenceid;
    }

    private java.lang.Object __equalsCalc = null;
    public synchronized boolean equals(java.lang.Object obj) {
        if (!(obj instanceof SendRespMsg)) return false;
        SendRespMsg other = (SendRespMsg) obj;
        if (obj == null) return false;
        if (this == obj) return true;
        if (__equalsCalc != null) {
            return (__equalsCalc == obj);
        }
        __equalsCalc = obj;
        boolean _equals;
        _equals = true && 
            ((this.hd==null && other.getHd()==null) || 
             (this.hd!=null &&
              this.hd.equals(other.getHd()))) &&
            ((this.msgid==null && other.getMsgid()==null) || 
             (this.msgid!=null &&
              this.msgid.equals(other.getMsgid()))) &&
            ((this.msisdn==null && other.getMsisdn()==null) || 
             (this.msisdn!=null &&
              this.msisdn.equals(other.getMsisdn()))) &&
            this.nums == other.getNums() &&
            ((this.result==null && other.getResult()==null) || 
             (this.result!=null &&
              this.result.equals(other.getResult()))) &&
            ((this.sequenceid==null && other.getSequenceid()==null) || 
             (this.sequenceid!=null &&
              this.sequenceid.equals(other.getSequenceid())));
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
        if (getHd() != null) {
            _hashCode += getHd().hashCode();
        }
        if (getMsgid() != null) {
            _hashCode += getMsgid().hashCode();
        }
        if (getMsisdn() != null) {
            _hashCode += getMsisdn().hashCode();
        }
        _hashCode += getNums();
        if (getResult() != null) {
            _hashCode += getResult().hashCode();
        }
        if (getSequenceid() != null) {
            _hashCode += getSequenceid().hashCode();
        }
        __hashCodeCalc = false;
        return _hashCode;
    }

    // Type metadata
    private static org.apache.axis.description.TypeDesc typeDesc =
        new org.apache.axis.description.TypeDesc(SendRespMsg.class, true);

    static {
        typeDesc.setXmlType(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "SendRespMsg"));
        org.apache.axis.description.ElementDesc elemField = new org.apache.axis.description.ElementDesc();
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
        elemField.setFieldName("nums");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "nums"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "int"));
        elemField.setNillable(false);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("result");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "result"));
        elemField.setXmlType(new javax.xml.namespace.QName("http://www.w3.org/2001/XMLSchema", "string"));
        elemField.setNillable(true);
        typeDesc.addFieldDesc(elemField);
        elemField = new org.apache.axis.description.ElementDesc();
        elemField.setFieldName("sequenceid");
        elemField.setXmlName(new javax.xml.namespace.QName("http://model.sms.app.egs.hnisi.com.cn", "sequenceid"));
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

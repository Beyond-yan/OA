package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.math.BigDecimal;
import java.text.SimpleDateFormat;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.time.DateUtils;

import com.google.gson.annotations.Expose;
import com.gdssoft.core.Constants;
import com.gdssoft.core.jbpm.pv.ParamField;

/**
 * FormData Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class FormData extends com.gdssoft.core.model.BaseModel {
	//该值将显示在列表中
	public static final Short SHOWED=1;
	//该址不显示在结果中，仅作参与流程的数据运算或条件
	public static final Short UNSHOWED=0;
	
	@Expose
    protected Long dataId;
	protected String fieldLabel;
	protected String fieldName;
	protected Integer intValue;
	protected Long longValue;
	protected java.math.BigDecimal decValue;
	protected java.util.Date dateValue;
	protected String strValue;
	protected String blobValue;
	protected Short boolValue;
	protected String textValue;
	protected Short isShowed=1;
	protected String fieldType;
	
	protected com.gdssoft.oa.model.flow.ProcessForm processForm;

	public FormData (ParamField pf) {
		copyValue(pf);
	}
	
	public void copyValue(ParamField pf){
		this.fieldLabel=pf.getLabel();
		this.fieldName=pf.getName();
		this.fieldType=pf.getType();
		this.isShowed=pf.getIsShowed();
		
		setValue(pf.getValue(),pf.getType());
	}
	
	public Object getValue(){
		
		if(strValue!=null) return strValue;
		if(intValue!=null)return intValue;
		if(longValue!=null) return longValue;
		if(decValue!=null) return decValue;
		if(dateValue!=null) return dateValue;
		if(boolValue!=null)return boolValue;
		if(textValue!=null)return textValue;
		return null;
	}
	
	/**
	 * 显示字符
	 * @return
	 */
	public String getVal(){
		
		if(ParamField.FIELD_TYPE_VARCHAR.equals(fieldType)){
			return strValue;
		}
		
		if(ParamField.FIELD_TYPE_DATE.equals(fieldType)){
			SimpleDateFormat sdf=new SimpleDateFormat(Constants.DATE_FORMAT_YMD);
			return dateValue==null? null:sdf.format(dateValue); 
		}
		
		if(ParamField.FIELD_TYPE_DATETIME.equals(fieldType)){
			SimpleDateFormat sdf=new SimpleDateFormat(Constants.DATE_FORMAT_FULL);
			return dateValue==null? null:sdf.format(dateValue);
		}
		
		if(ParamField.FIELD_TYPE_INT.equals(fieldType)){
			return intValue==null?null:intValue.toString();
		}
		
		if(ParamField.FIELD_TYPE_LONG.equals(fieldType)){
			return longValue==null?null:longValue.toString();
		}
		
		if(ParamField.FIELD_TYPE_DECIMAL.equals(fieldType)){
			return decValue==null? null:decValue.toString();
		}
		
		if(ParamField.FIELD_TYPE_TEXT.equals(fieldType)){
			return textValue;
		}
		
		if(ParamField.FIELD_TYPE_FILE.equals(fieldType)){
			return strValue;
		}
		
		if(ParamField.FIELD_TYPE_BOOL.equals(fieldType)){
			return boolValue==1?"是":"否";
		}
		
		return null;
	}
	
	public void setValue(String val,String type){
		
		if(val==null) return;
		
		try {
			if(ParamField.FIELD_TYPE_VARCHAR.equals(type)){
				this.strValue=val;
			}else if (ParamField.FIELD_TYPE_BOOL.equals(type)) {
				this.boolValue = "1".equals(val) ? (short) 1 : (short) 0;
			} else if (ParamField.FIELD_TYPE_DATE.equals(type) || ParamField.FIELD_TYPE_DATETIME.equals(type)) {
				this.dateValue = DateUtils.parseDate(val,new String[] { Constants.DATE_FORMAT_FULL,Constants.DATE_FORMAT_YMD});
			} else if (ParamField.FIELD_TYPE_DECIMAL.equals(type)){
				this.decValue=new BigDecimal(val);
			} else if(ParamField.FIELD_TYPE_INT.equals(type)){
				this.intValue=new Integer(val);
			} else if(ParamField.FIELD_TYPE_LONG.equals(type)){
				this.longValue=new Long(val);
			}else if(ParamField.FIELD_TYPE_TEXT.equals(type)){
				this.textValue=val;
			}else if(ParamField.FIELD_TYPE_FILE.equals(type)){
				this.strValue=val;
			}
		} catch (Exception ex) {
			logger.warn("setValue error:" + ex.getMessage());
		}
	}
	

	/**
	 * Default Empty Constructor for class FormData
	 */
	public FormData () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class FormData
	 */
	public FormData (
		 Long in_dataId
        ) {
		this.setDataId(in_dataId);
    }

	
	public com.gdssoft.oa.model.flow.ProcessForm getProcessForm () {
		return processForm;
	}	
	
	public void setProcessForm (com.gdssoft.oa.model.flow.ProcessForm in_processForm) {
		this.processForm = in_processForm;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="dataId" type="java.lang.Long" generator-class="native"
	 */
	public Long getDataId() {
		return this.dataId;
	}
	
	/**
	 * Set the dataId
	 */	
	public void setDataId(Long aValue) {
		this.dataId = aValue;
	}	

	/**
	 * 所属表单	 * @return Long
	 */
	public Long getFormId() {
		return this.getProcessForm()==null?null:this.getProcessForm().getFormId();
	}

	public Short getBoolValue() {
		return boolValue;
	}

	public void setBoolValue(Short boolValue) {
		this.boolValue = boolValue;
	}

	/**
	 * Set the formId
	 */	
	public void setFormId(Long aValue) {
	    if (aValue==null) {
	    	processForm = null;
	    } else if (processForm == null) {
	        processForm = new com.gdssoft.oa.model.flow.ProcessForm(aValue);
	        processForm.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			processForm.setFormId(aValue);
	    }
	}	

	/**
	 * 字段标签	 * @return String
	 * @hibernate.property column="fieldLabel" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getFieldLabel() {
		return this.fieldLabel;
	}
	
	/**
	 * Set the fieldLabel
	 * @spring.validator type="required"
	 */	
	public void setFieldLabel(String aValue) {
		this.fieldLabel = aValue;
	}	

	/**
	 * 字段名称	 * @return String
	 * @hibernate.property column="fieldName" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getFieldName() {
		return this.fieldName;
	}
	
	/**
	 * Set the fieldName
	 * @spring.validator type="required"
	 */	
	public void setFieldName(String aValue) {
		this.fieldName = aValue;
	}	

	/**
	 * 整数值	 * @return Integer
	 * @hibernate.property column="intValue" type="java.lang.Integer" length="10" not-null="false" unique="false"
	 */
	public Integer getIntValue() {
		return this.intValue;
	}
	
	/**
	 * Set the intValue
	 */	
	public void setIntValue(Integer aValue) {
		this.intValue = aValue;
	}	

	/**
	 * 精度值	 * @return java.math.BigDecimal
	 * @hibernate.property column="decValue" type="java.math.BigDecimal" length="18" not-null="false" unique="false"
	 */
	public java.math.BigDecimal getDecValue() {
		return this.decValue;
	}
	
	/**
	 * Set the decValue
	 */	
	public void setDecValue(java.math.BigDecimal aValue) {
		this.decValue = aValue;
	}	

	/**
	 * 日期值	 * @return java.util.Date
	 * @hibernate.property column="dateValue" type="java.util.Date" length="19" not-null="false" unique="false"
	 */
	public java.util.Date getDateValue() {
		return this.dateValue;
	}
	
	/**
	 * Set the dateValue
	 */	
	public void setDateValue(java.util.Date aValue) {
		this.dateValue = aValue;
	}	

	/**
	 * 字符值	 * @return String
	 * @hibernate.property column="strValue" type="java.lang.String" length="5000" not-null="false" unique="false"
	 */
	public String getStrValue() {
		return this.strValue;
	}
	
	/**
	 * Set the strValue
	 */	
	public void setStrValue(String aValue) {
		this.strValue = aValue;
	}	

	/**
	 * 对象值	 * @return String
	 * @hibernate.property column="blobValue" type="java.lang.String" length="65535" not-null="false" unique="false"
	 */
	public String getBlobValue() {
		return this.blobValue;
	}
	
	/**
	 * Set the blobValue
	 */	
	public void setBlobValue(String aValue) {
		this.blobValue = aValue;
	}	

	/**
	 * 是否显示
            1=显示
            0=不显示	 * @return Short
	 * @hibernate.property column="isShowed" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getIsShowed() {
		return this.isShowed;
	}
	
	/**
	 * Set the isShowed
	 * @spring.validator type="required"
	 */	
	public void setIsShowed(Short aValue) {
		this.isShowed = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof FormData)) {
			return false;
		}
		FormData rhs = (FormData) object;
		return new EqualsBuilder()
				.append(this.dataId, rhs.dataId)
						.append(this.fieldLabel, rhs.fieldLabel)
				.append(this.fieldName, rhs.fieldName)
				.append(this.intValue, rhs.intValue)
				.append(this.decValue, rhs.decValue)
				.append(this.dateValue, rhs.dateValue)
				.append(this.strValue, rhs.strValue)
				.append(this.blobValue, rhs.blobValue)
				.append(this.isShowed, rhs.isShowed)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.dataId) 
						.append(this.fieldLabel) 
				.append(this.fieldName) 
				.append(this.intValue) 
				.append(this.decValue) 
				.append(this.dateValue) 
				.append(this.strValue) 
				.append(this.blobValue) 
				.append(this.isShowed) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("dataId", this.dataId) 
						.append("fieldLabel", this.fieldLabel) 
				.append("fieldName", this.fieldName) 
				.append("intValue", this.intValue) 
				.append("decValue", this.decValue) 
				.append("dateValue", this.dateValue) 
				.append("strValue", this.strValue) 
				.append("blobValue", this.blobValue) 
				.append("isShowed", this.isShowed) 
				.toString();
	}

	public Long getLongValue() {
		return longValue;
	}

	public void setLongValue(Long longValue) {
		this.longValue = longValue;
	}

	public String getTextValue() {
		return textValue;
	}

	public void setTextValue(String textValue) {
		this.textValue = textValue;
	}

	public String getFieldType() {
		return fieldType;
	}

	public void setFieldType(String fieldType) {
		this.fieldType = fieldType;
	}

}

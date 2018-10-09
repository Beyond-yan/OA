package com.gdssoft.oa.model.admin;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * CarCardHistory Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class CarCardHistory extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected Short cardType; 
	protected Long cardId;
	protected Short useType;
	protected String amount;
	protected java.util.Date useDate;
	protected String description;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	/**
	 * Default Empty Constructor for class CarCardHistory
	 */
	public CarCardHistory () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class CarCardHistory
	 */
	public CarCardHistory (
		 Long in_id
        ) {
		this.setId(in_id);
    }

    

	/**
	 * 	 * @return Long
     * @hibernate.id column="ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getId() {
		return this.id;
	}
	
	/**
	 * Set the id
	 */	
	public void setId(Long aValue) {
		this.id = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="CARD_TYPE" type="java.lang.Short" length="5" not-null="false" unique="false"
	 */
	public Short getCardType() {
		return this.cardType;
	}
	
	/**
	 * Set the cardType
	 */	
	public void setCardType(Short aValue) {
		this.cardType = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="CARD_ID" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getCardId() {
		return this.cardId;
	}
	
	/**
	 * Set the cardId
	 * @spring.validator type="required"
	 */	
	public void setCardId(Long aValue) {
		this.cardId = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="USE_TYPE" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getUseType() {
		return this.useType;
	}
	
	/**
	 * Set the useType
	 * @spring.validator type="required"
	 */	
	public void setUseType(Short aValue) {
		this.useType = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="AMOUNT" type="java.lang.String" length="18" not-null="false" unique="false"
	 */
	public String getAmount() {
		return this.amount;
	}
	
	/**
	 * Set the amount
	 */	
	public void setAmount(String aValue) {
		this.amount = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="USE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getUseDate() {
		return this.useDate;
	}
	
	/**
	 * Set the useDate
	 */	
	public void setUseDate(java.util.Date aValue) {
		this.useDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DESCRIPTION" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getDescription() {
		return this.description;
	}
	
	/**
	 * Set the description
	 */	
	public void setDescription(String aValue) {
		this.description = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getCreateDate() {
		return this.createDate;
	}
	
	/**
	 * Set the createDate
	 */	
	public void setCreateDate(java.util.Date aValue) {
		this.createDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CREATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getCreateBy() {
		return this.createBy;
	}
	
	/**
	 * Set the createBy
	 */	
	public void setCreateBy(String aValue) {
		this.createBy = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getUpdateDate() {
		return this.updateDate;
	}
	
	/**
	 * Set the updateDate
	 */	
	public void setUpdateDate(java.util.Date aValue) {
		this.updateDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="UPDATE_BY" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getUpdateBy() {
		return this.updateBy;
	}
	
	/**
	 * Set the updateBy
	 */	
	public void setUpdateBy(String aValue) {
		this.updateBy = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof CarCardHistory)) {
			return false;
		}
		CarCardHistory rhs = (CarCardHistory) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.cardType, rhs.cardType)
				.append(this.cardId, rhs.cardId)
				.append(this.useType, rhs.useType)
				.append(this.amount, rhs.amount)
				.append(this.useDate, rhs.useDate)
				.append(this.description, rhs.description)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.cardType) 
				.append(this.cardId) 
				.append(this.useType) 
				.append(this.amount) 
				.append(this.useDate) 
				.append(this.description) 
				.append(this.createDate) 
				.append(this.createBy) 
				.append(this.updateDate) 
				.append(this.updateBy) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("cardType", this.cardType) 
				.append("cardId", this.cardId) 
				.append("useType", this.useType) 
				.append("amount", this.amount) 
				.append("useDate", this.useDate) 
				.append("description", this.description) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}

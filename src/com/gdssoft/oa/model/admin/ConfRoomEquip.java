package com.gdssoft.oa.model.admin;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * ConfRoomEquip Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class ConfRoomEquip extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected String name;
	protected Short amount;
	protected String description;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected com.gdssoft.oa.model.admin.Boardroo Boardroo;
	
	

	/**
	 * Default Empty Constructor for class ConfRoomEquip
	 */
	public ConfRoomEquip () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ConfRoomEquip
	 */
	public ConfRoomEquip (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.admin.Boardroo getBoardroo () {
		return Boardroo;
	}	
	
	public void setBoardroo (com.gdssoft.oa.model.admin.Boardroo in_Boardroo) {
		this.Boardroo = in_Boardroo;
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
	 * 	 * @return Long
	 */
	public Long getRoomId() {
		return this.getBoardroo()==null?null:this.getBoardroo().getRoomId();
	}
	
	/**
	 * Set the roomId
	 */	
	public void setRoomId(Long aValue) {
	    if (aValue==null) {
	    	Boardroo = null;
	    } else if (Boardroo == null) {
	        Boardroo = new com.gdssoft.oa.model.admin.Boardroo(aValue);
	        Boardroo.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			Boardroo.setRoomId(aValue);
	    }
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="NAME" type="java.lang.String" length="50" not-null="true" unique="false"
	 */
	public String getName() {
		return this.name;
	}
	
	/**
	 * Set the name
	 * @spring.validator type="required"
	 */	
	public void setName(String aValue) {
		this.name = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="AMOUNT" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getAmount() {
		return this.amount;
	}
	
	/**
	 * Set the amount
	 * @spring.validator type="required"
	 */	
	public void setAmount(Short aValue) {
		this.amount = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DESCRIPTION" type="java.lang.String" length="200" not-null="false" unique="false"
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
		if (!(object instanceof ConfRoomEquip)) {
			return false;
		}
		ConfRoomEquip rhs = (ConfRoomEquip) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.name, rhs.name)
				.append(this.amount, rhs.amount)
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
						.append(this.name) 
				.append(this.amount) 
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
						.append("name", this.name) 
				.append("amount", this.amount) 
				.append("description", this.description) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}

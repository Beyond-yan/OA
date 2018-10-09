package com.gdssoft.oa.model.admin;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * CarInsurance Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class CarInsurance extends com.gdssoft.core.model.BaseModel {

    protected Long id;
    protected Long carId;
	protected java.util.Date buyDate;
	protected java.util.Date insrSDate;
	protected java.util.Date insrEDate;
	protected String insrCompany;
	protected String ref1;
	protected String ref2;
	protected String ref3;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected com.gdssoft.oa.model.admin.Car car;


	/**
	 * Default Empty Constructor for class CarInsurance
	 */
	public CarInsurance () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class CarInsurance
	 */
	public CarInsurance (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.admin.Car getCar () {
		return car;
	}	
	
	public void setCar (com.gdssoft.oa.model.admin.Car in_car) {
		this.car = in_car;
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
	public Long getCarId() {
		return this.getCar()==null?null:this.getCar().getCarid();
	}
	
	
	
	/**
	 * Set the carId
	 */	
	public void setCarId(Long aValue) {
	    if (aValue==null) {
	    	car = null;
	    } else if (car == null) {
	        car = new com.gdssoft.oa.model.admin.Car(aValue);
	        car.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			car.setCarid(aValue);
	    }
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="BUY_DATE" type="java.util.Date" length="23" not-null="true" unique="false"
	 */
	public java.util.Date getBuyDate() {
		return this.buyDate;
	}
	
	/**
	 * Set the buyDate
	 * @spring.validator type="required"
	 */	
	public void setBuyDate(java.util.Date aValue) {
		this.buyDate = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="INSR_S_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getInsrSDate() {
		return this.insrSDate;
	}
	
	/**
	 * Set the insrSDate
	 */	
	public void setInsrSDate(java.util.Date aValue) {
		this.insrSDate = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="INSR_E_DATE" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getInsrEDate() {
		return this.insrEDate;
	}
	
	/**
	 * Set the insrEDate
	 */	
	public void setInsrEDate(java.util.Date aValue) {
		this.insrEDate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="INSR_COMPANY" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getInsrCompany() {
		return this.insrCompany;
	}
	
	/**
	 * Set the insrCompany
	 */	
	public void setInsrCompany(String aValue) {
		this.insrCompany = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF1" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef1() {
		return this.ref1;
	}
	
	/**
	 * Set the ref1
	 */	
	public void setRef1(String aValue) {
		this.ref1 = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF2" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef2() {
		return this.ref2;
	}
	
	/**
	 * Set the ref2
	 */	
	public void setRef2(String aValue) {
		this.ref2 = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="REF3" type="java.lang.String" length="50" not-null="false" unique="false"
	 */
	public String getRef3() {
		return this.ref3;
	}
	
	/**
	 * Set the ref3
	 */	
	public void setRef3(String aValue) {
		this.ref3 = aValue;
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
		if (!(object instanceof CarInsurance)) {
			return false;
		}
		CarInsurance rhs = (CarInsurance) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
						.append(this.buyDate, rhs.buyDate)
				.append(this.insrSDate, rhs.insrSDate)
				.append(this.insrEDate, rhs.insrEDate)
				.append(this.insrCompany, rhs.insrCompany)
				.append(this.ref1, rhs.ref1)
				.append(this.ref2, rhs.ref2)
				.append(this.ref3, rhs.ref3)
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
						.append(this.buyDate) 
				.append(this.insrSDate) 
				.append(this.insrEDate) 
				.append(this.insrCompany) 
				.append(this.ref1) 
				.append(this.ref2) 
				.append(this.ref3) 
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
						.append("buyDate", this.buyDate) 
				.append("insrSDate", this.insrSDate) 
				.append("insrEDate", this.insrEDate) 
				.append("insrCompany", this.insrCompany) 
				.append("ref1", this.ref1) 
				.append("ref2", this.ref2) 
				.append("ref3", this.ref3) 
				.append("createDate", this.createDate) 
				.append("createBy", this.createBy) 
				.append("updateDate", this.updateDate) 
				.append("updateBy", this.updateBy) 
				.toString();
	}



}

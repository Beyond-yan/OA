package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

/**
 * CarDriver Base Java Bean, base class for the.oa.model, mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 * 
 */
public class CarDriver extends com.gdssoft.core.model.BaseModel {

	protected Long id;
	protected String code;
	protected String name;
	protected String cellPhone;
	protected String shortPhone;
	protected String homePhone;
	protected String email;
	protected Short isLeaving;
	protected String imageSource;
	protected Short licenseClass;
	protected java.util.Date licenseSDt;
	protected java.util.Date licenseEDt;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	protected Short status;// 状态 1:空闲 2:出车
	protected java.util.Set carUsings = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class CarDriver
	 */
	public CarDriver() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class CarDriver
	 */
	public CarDriver(Long in_id) {
		this.setId(in_id);
	}

	public java.util.Set getCarUsings() {
		return carUsings;
	}

	public void setCarUsings(java.util.Set in_carUsings) {
		this.carUsings = in_carUsings;
	}

	/**
	 * * @return Long
	 * 
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
	 * * @return String
	 * 
	 * @hibernate.property column="CODE" type="java.lang.String" length="30"
	 *                     not-null="false" unique="false"
	 */
	public String getCode() {
		return this.code;
	}

	/**
	 * Set the code
	 */
	public void setCode(String aValue) {
		this.code = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="NAME" type="java.lang.String" length="50"
	 *                     not-null="true" unique="false"
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * Set the name
	 * 
	 * @spring.validator type="required"
	 */
	public void setName(String aValue) {
		this.name = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="CELL_PHONE" type="java.lang.String"
	 *                     length="30" not-null="false" unique="false"
	 */
	public String getCellPhone() {
		return this.cellPhone;
	}

	/**
	 * Set the cellPhone
	 */
	public void setCellPhone(String aValue) {
		this.cellPhone = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="SHORT_PHONE" type="java.lang.String"
	 *                     length="30" not-null="false" unique="false"
	 */
	public String getShortPhone() {
		return this.shortPhone;
	}

	/**
	 * Set the shortPhone
	 */
	public void setShortPhone(String aValue) {
		this.shortPhone = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="HOME_PHONE" type="java.lang.String"
	 *                     length="30" not-null="false" unique="false"
	 */
	public String getHomePhone() {
		return this.homePhone;
	}

	/**
	 * Set the homePhone
	 */
	public void setHomePhone(String aValue) {
		this.homePhone = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="EMAIL" type="java.lang.String" length="150"
	 *                     not-null="false" unique="false"
	 */
	public String getEmail() {
		return this.email;
	}

	/**
	 * Set the email
	 */
	public void setEmail(String aValue) {
		this.email = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="IS_LEAVING" type="java.lang.Short" length="5"
	 *                     not-null="true" unique="false"
	 */
	public Short getIsLeaving() {
		return this.isLeaving;
	}

	/**
	 * Set the isLeaving
	 * 
	 * @spring.validator type="required"
	 */
	public void setIsLeaving(Short aValue) {
		this.isLeaving = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="IMAGE_SOURCE" type="java.lang.String"
	 *                     length="150" not-null="false" unique="false"
	 */
	public String getImageSource() {
		return this.imageSource;
	}

	/**
	 * Set the imageSource
	 */
	public void setImageSource(String aValue) {
		this.imageSource = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="LICENSE_CLASS" type="java.lang.Short"
	 *                     length="5" not-null="false" unique="false"
	 */
	public Short getLicenseClass() {
		return this.licenseClass;
	}

	/**
	 * Set the licenseClass
	 */
	public void setLicenseClass(Short aValue) {
		this.licenseClass = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="LICENSE_S_DT" type="java.util.Date"
	 *                     length="23" not-null="false" unique="false"
	 */
	public java.util.Date getLicenseSDt() {
		return this.licenseSDt;
	}

	/**
	 * Set the licenseSDt
	 */
	public void setLicenseSDt(java.util.Date aValue) {
		this.licenseSDt = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="LICENSE_E_DT" type="java.util.Date"
	 *                     length="23" not-null="false" unique="false"
	 */
	public java.util.Date getLicenseEDt() {
		return this.licenseEDt;
	}

	/**
	 * Set the licenseEDt
	 */
	public void setLicenseEDt(java.util.Date aValue) {
		this.licenseEDt = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date"
	 *                     length="23" not-null="false" unique="false"
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
	 * * @return String
	 * 
	 * @hibernate.property column="CREATE_BY" type="java.lang.String"
	 *                     length="50" not-null="false" unique="false"
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
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="UPDATE_DATE" type="java.util.Date"
	 *                     length="23" not-null="false" unique="false"
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
	 * * @return String
	 * 
	 * @hibernate.property column="UPDATE_BY" type="java.lang.String"
	 *                     length="50" not-null="false" unique="false"
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

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof CarDriver)) {
			return false;
		}
		CarDriver rhs = (CarDriver) object;
		return new EqualsBuilder().append(this.id, rhs.id).append(this.code,
				rhs.code).append(this.name, rhs.name).append(this.cellPhone,
				rhs.cellPhone).append(this.shortPhone, rhs.shortPhone).append(
				this.homePhone, rhs.homePhone).append(this.email, rhs.email)
				.append(this.isLeaving, rhs.isLeaving).append(this.imageSource,
						rhs.imageSource).append(this.licenseClass,
						rhs.licenseClass).append(this.licenseSDt,
						rhs.licenseSDt).append(this.licenseEDt, rhs.licenseEDt)
				.append(this.createDate, rhs.createDate).append(this.createBy,
						rhs.createBy).append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.id)
				.append(this.code).append(this.name).append(this.cellPhone)
				.append(this.shortPhone).append(this.homePhone).append(
						this.email).append(this.isLeaving).append(
						this.imageSource).append(this.licenseClass).append(
						this.licenseSDt).append(this.licenseEDt).append(
						this.createDate).append(this.createBy).append(
						this.updateDate).append(this.updateBy).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("id", this.id).append("code",
				this.code).append("name", this.name).append("cellPhone",
				this.cellPhone).append("shortPhone", this.shortPhone).append(
				"homePhone", this.homePhone).append("email", this.email)
				.append("isLeaving", this.isLeaving).append("imageSource",
						this.imageSource).append("licenseClass",
						this.licenseClass)
				.append("licenseSDt", this.licenseSDt).append("licenseEDt",
						this.licenseEDt).append("createDate", this.createDate)
				.append("createBy", this.createBy).append("updateDate",
						this.updateDate).append("updateBy", this.updateBy)
				.toString();
	}

}

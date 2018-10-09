package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.google.gson.annotations.Expose;

/**
 * CarOilCard Base Java Bean, base class for the.oa.model, mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 * 
 */
public class CarOilCard extends com.gdssoft.core.model.BaseModel {
	@Expose
	protected Long id;
	@Expose
	protected Short type;
	@Expose
	protected String code;
	@Expose
	protected String sn;
	@Expose
	protected String remains;
	@Expose
	protected String oilCompany;
	@Expose
	protected java.util.Date buyDate;
	@Expose
	protected java.util.Date validSDate;
	@Expose
	protected java.util.Date validEDate;
	@Expose
	protected String remark;
	@Expose
	protected Short status;// 1:可用 0:不可用
	@Expose
	protected java.util.Date createDate;
	@Expose
	protected String createBy;
	@Expose
	protected java.util.Date updateDate;
	@Expose
	protected String updateBy;
	@Expose
	protected String cost;

	protected java.util.Set cars = new java.util.HashSet();
	protected java.util.Set carUsings = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class CarOilCard
	 */
	public CarOilCard() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class CarOilCard
	 */
	public CarOilCard(Long in_id) {
		this.setId(in_id);
	}

	public java.util.Set getCars() {
		return cars;
	}

	public void setCars(java.util.Set in_cars) {
		this.cars = in_cars;
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
	 * * @return Short
	 * 
	 * @hibernate.property column="TYPE" type="java.lang.Short" length="5"
	 *                     not-null="true" unique="false"
	 */
	public Short getType() {
		return this.type;
	}

	/**
	 * Set the type
	 * 
	 * @spring.validator type="required"
	 */
	public void setType(Short aValue) {
		this.type = aValue;
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
	 * @hibernate.property column="SN" type="java.lang.String" length="30"
	 *                     not-null="false" unique="false"
	 */
	public String getSn() {
		return this.sn;
	}

	/**
	 * Set the sn
	 */
	public void setSn(String aValue) {
		this.sn = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="REMAINS" type="java.lang.String" length="18"
	 *                     not-null="false" unique="false"
	 */
	public String getRemains() {
		return this.remains;
	}

	/**
	 * Set the remains
	 */
	public void setRemains(String aValue) {
		this.remains = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="OIL_COMPANY" type="java.lang.String"
	 *                     length="30" not-null="false" unique="false"
	 */
	public String getOilCompany() {
		return this.oilCompany;
	}

	/**
	 * Set the oilCompany
	 */
	public void setOilCompany(String aValue) {
		this.oilCompany = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="BUY_DATE" type="java.util.Date" length="23"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getBuyDate() {
		return this.buyDate;
	}

	/**
	 * Set the buyDate
	 */
	public void setBuyDate(java.util.Date aValue) {
		this.buyDate = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="VALID_S_DATE" type="java.util.Date"
	 *                     length="23" not-null="false" unique="false"
	 */
	public java.util.Date getValidSDate() {
		return this.validSDate;
	}

	/**
	 * Set the validSDate
	 */
	public void setValidSDate(java.util.Date aValue) {
		this.validSDate = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="VALID_E_DATE" type="java.util.Date"
	 *                     length="23" not-null="false" unique="false"
	 */
	public java.util.Date getValidEDate() {
		return this.validEDate;
	}

	/**
	 * Set the validEDate
	 */
	public void setValidEDate(java.util.Date aValue) {
		this.validEDate = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="REMARK" type="java.lang.String" length="400"
	 *                     not-null="false" unique="false"
	 */
	public String getRemark() {
		return this.remark;
	}

	/**
	 * Set the remark
	 */
	public void setRemark(String aValue) {
		this.remark = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="STATUS" type="java.lang.Short" length="5"
	 *                     not-null="true" unique="false"
	 */
	public Short getStatus() {
		return this.status;
	}

	/**
	 * Set the status
	 * 
	 * @spring.validator type="required"
	 */
	public void setStatus(Short aValue) {
		this.status = aValue;
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

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="COST" type="java.lang.String" length="10"
	 *                     not-null="false" unique="false"
	 */
	public String getCost() {
		return cost;
	}

	public void setCost(String cost) {
		this.cost = cost;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof CarOilCard)) {
			return false;
		}
		CarOilCard rhs = (CarOilCard) object;
		return new EqualsBuilder().append(this.id, rhs.id).append(this.type,
				rhs.type).append(this.code, rhs.code).append(this.sn, rhs.sn)
				.append(this.remains, rhs.remains).append(this.oilCompany,
						rhs.oilCompany).append(this.buyDate, rhs.buyDate)
				.append(this.validSDate, rhs.validSDate).append(
						this.validEDate, rhs.validEDate).append(this.remark,
						rhs.remark).append(this.status, rhs.status).append(
						this.createDate, rhs.createDate).append(this.createBy,
						rhs.createBy).append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.id)
				.append(this.type).append(this.code).append(this.sn).append(
						this.remains).append(this.oilCompany).append(
						this.buyDate).append(this.validSDate).append(
						this.validEDate).append(this.remark)
				.append(this.status).append(this.createDate).append(
						this.createBy).append(this.updateDate).append(
						this.updateBy).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("id", this.id).append("type",
				this.type).append("code", this.code).append("sn", this.sn)
				.append("remains", this.remains).append("oilCompany",
						this.oilCompany).append("buyDate", this.buyDate)
				.append("validSDate", this.validSDate).append("validEDate",
						this.validEDate).append("remark", this.remark).append(
						"status", this.status).append("createDate",
						this.createDate).append("createBy", this.createBy)
				.append("updateDate", this.updateDate).append("updateBy",
						this.updateBy).toString();
	}

}

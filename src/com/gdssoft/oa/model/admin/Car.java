package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.oa.model.system.Department;
import com.google.gson.annotations.Expose;

/**
 * Car Base Java Bean, base class for the.oa.model, mapped directly to database
 * table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 * 
 */
public class Car extends com.gdssoft.core.model.BaseModel {

	@Expose
	protected Long carid;
	@Expose
	protected String carno;
	@Expose
	protected String cartype;
	@Expose
	protected String engineno;
	@Expose
	protected java.util.Date buyinsuretime;
	@Expose
	protected java.util.Date audittime;
	@Expose
	protected String notes;
	@Expose
	protected String factorymodel;
	@Expose
	protected String driver;
	@Expose
	protected java.util.Date buydate;
	@Expose
	protected Short status;
	@Expose
	protected String cartimage;
	@Expose
	protected Short purpose;
	@Expose
	protected Short carClass;
	@Expose
	protected Short passAmount;
	@Expose
	protected Long belongDeptId;
	@Expose
	protected Short usingStatus;
	protected String distance;
	protected String engineSpec;
	protected String purchase;
	protected String isPublic;
	@Expose
	protected Department department;
	@Expose
	protected java.util.Date createDate;
	@Expose
	protected String createBy;
	@Expose
	protected java.util.Date updateDate;
	@Expose
	protected String userFullName;
	@Expose
	protected String updateBy;
	protected com.gdssoft.oa.model.admin.CarOilCard carOilCard;
	protected com.gdssoft.oa.model.admin.CarPassFeeCard carPassFeeCard;

	protected java.util.Set carApplys = new java.util.HashSet();
	protected java.util.Set carInsurances = new java.util.HashSet();
	protected java.util.Set carUsings = new java.util.HashSet();
	protected java.util.Set cartRepairs = new java.util.HashSet();
	@Expose
	protected java.util.Date startTime;
	@Expose
	protected java.util.Date endTime;
	/**
	 * Default Empty Constructor for class Car
	 */
	public Car() {
		super();
	}

	public String getUserFullName() {
		return userFullName;
	}

	public void setUserFullName(String userFullName) {
		this.userFullName = userFullName;
	}

	public java.util.Date getStartTime() {
		return startTime;
	}

	public void setStartTime(java.util.Date startTime) {
		this.startTime = startTime;
	}

	public java.util.Date getEndTime() {
		return endTime;
	}

	public void setEndTime(java.util.Date endTime) {
		this.endTime = endTime;
	}

	/**
	 * Default Key Fields Constructor for class Car
	 */
	public Car(Long in_carid) {
		this.setCarid(in_carid);
	}

	public com.gdssoft.oa.model.admin.CarOilCard getCarOilCard() {
		return carOilCard;
	}

	public void setCarOilCard(
			com.gdssoft.oa.model.admin.CarOilCard in_carOilCard) {
		this.carOilCard = in_carOilCard;
	}

	public com.gdssoft.oa.model.admin.CarPassFeeCard getCarPassFeeCard() {
		return carPassFeeCard;
	}

	public void setCarPassFeeCard(
			com.gdssoft.oa.model.admin.CarPassFeeCard in_carPassFeeCard) {
		this.carPassFeeCard = in_carPassFeeCard;
	}

	public java.util.Set getCarApplys() {
		return carApplys;
	}

	public void setCarApplys(java.util.Set in_carApplys) {
		this.carApplys = in_carApplys;
	}

	public java.util.Set getCarInsurances() {
		return carInsurances;
	}

	public void setCarInsurances(java.util.Set in_carInsurances) {
		this.carInsurances = in_carInsurances;
	}

	public java.util.Set getCarUsings() {
		return carUsings;
	}

	public void setCarUsings(java.util.Set in_carUsings) {
		this.carUsings = in_carUsings;
	}

	public java.util.Set getCartRepairs() {
		return cartRepairs;
	}

	public void setCartRepairs(java.util.Set in_cartRepairs) {
		this.cartRepairs = in_cartRepairs;
	}
	/**
	 * * @return Long
	 * 
	 * @hibernate.id column="carid" type="java.lang.Long"
	 *               generator-class="native"
	 */
	public Long getCarid() {
		return this.carid;
	}

	/**
	 * Set the carid
	 */
	public void setCarid(Long aValue) {
		this.carid = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="carno" type="java.lang.String" length="50"
	 *                     not-null="true" unique="false"
	 */
	public String getCarno() {
		return this.carno;
	}

	/**
	 * Set the carno
	 * 
	 * @spring.validator type="required"
	 */
	public void setCarno(String aValue) {
		this.carno = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="cartype" type="java.lang.String" length="10"
	 *                     not-null="true" unique="false"
	 */
	public String getCartype() {
		return this.cartype;
	}

	/**
	 * Set the cartype
	 * 
	 * @spring.validator type="required"
	 */
	public void setCartype(String aValue) {
		this.cartype = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="engineno" type="java.lang.String"
	 *                     length="100" not-null="false" unique="false"
	 */
	public String getEngineno() {
		return this.engineno;
	}

	/**
	 * Set the engineno
	 */
	public void setEngineno(String aValue) {
		this.engineno = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="buyinsuretime" type="java.util.Date"
	 *                     length="23" not-null="false" unique="false"
	 */
	public java.util.Date getBuyinsuretime() {
		return this.buyinsuretime;
	}

	/**
	 * Set the buyinsuretime
	 */
	public void setBuyinsuretime(java.util.Date aValue) {
		this.buyinsuretime = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="audittime" type="java.util.Date" length="23"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getAudittime() {
		return this.audittime;
	}

	/**
	 * Set the audittime
	 */
	public void setAudittime(java.util.Date aValue) {
		this.audittime = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="notes" type="java.lang.String" length="400"
	 *                     not-null="false" unique="false"
	 */
	public String getNotes() {
		return this.notes;
	}

	/**
	 * Set the notes
	 */
	public void setNotes(String aValue) {
		this.notes = aValue;
	}

	public String getFactorymodel() {
		return factorymodel;
	}

	public void setFactorymodel(String factorymodel) {
		this.factorymodel = factorymodel;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="driver" type="java.lang.String" length="32"
	 *                     not-null="false" unique="false"
	 */
	public String getDriver() {
		return this.driver;
	}

	/**
	 * Set the driver
	 */
	public void setDriver(String aValue) {
		this.driver = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="buydate" type="java.util.Date" length="23"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getBuydate() {
		return this.buydate;
	}

	/**
	 * Set the buydate
	 */
	public void setBuydate(java.util.Date aValue) {
		this.buydate = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="status" type="java.lang.Short" length="5"
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
	 * * @return String
	 * 
	 * @hibernate.property column="cartimage" type="java.lang.String"
	 *                     length="150" not-null="false" unique="false"
	 */
	public String getCartimage() {
		return this.cartimage;
	}

	/**
	 * Set the cartimage
	 */
	public void setCartimage(String aValue) {
		this.cartimage = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="PURPOSE" type="java.lang.Short" length="5"
	 *                     not-null="false" unique="false"
	 */
	public Short getPurpose() {
		return this.purpose;
	}

	/**
	 * Set the purpose
	 */
	public void setPurpose(Short aValue) {
		this.purpose = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="CAR_CLASS" type="java.lang.Short" length="5"
	 *                     not-null="false" unique="false"
	 */
	public Short getCarClass() {
		return this.carClass;
	}

	/**
	 * Set the carClass
	 */
	public void setCarClass(Short aValue) {
		this.carClass = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="PASS_AMOUNT" type="java.lang.Short"
	 *                     length="5" not-null="false" unique="false"
	 */
	public Short getPassAmount() {
		return this.passAmount;
	}

	/**
	 * Set the passAmount
	 */
	public void setPassAmount(Short aValue) {
		this.passAmount = aValue;
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.property column="BELONG_DEPT_ID" type="java.lang.Long"
	 *                     length="19" not-null="false" unique="false"
	 */
	public Long getBelongDeptId() {
		return this.belongDeptId;
	}

	/**
	 * Set the belongDeptId
	 */
	public void setBelongDeptId(Long aValue) {
		this.belongDeptId = aValue;
	}

	/**
	 * * @return Long
	 */
	public Long getOilCardId() {
		return this.getCarOilCard() == null ? null : this.getCarOilCard()
				.getId();
	}

	/**
	 * Set the oilCardId
	 */
	public void setOilCardId(Long aValue) {
		if (aValue == null) {
			carOilCard = null;
		} else if (carOilCard == null) {
			carOilCard = new com.gdssoft.oa.model.admin.CarOilCard(aValue);
			carOilCard.setVersion(new Integer(0));// set a version to cheat
			// hibernate only
		} else {
			carOilCard.setId(aValue);
		}
	}

	/**
	 * * @return Long
	 */
	public Long getPayCardId() {
		return this.getCarPassFeeCard() == null ? null : this
				.getCarPassFeeCard().getId();
	}

	/**
	 * Set the payCardId
	 */
	public void setPayCardId(Long aValue) {
		if (aValue == null) {
			carPassFeeCard = null;
		} else if (carPassFeeCard == null) {
			carPassFeeCard = new com.gdssoft.oa.model.admin.CarPassFeeCard(
					aValue);
			carPassFeeCard.setVersion(new Integer(0));// set a version to cheat
			// hibernate only
		} else {
			carPassFeeCard.setId(aValue);
		}
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="USING_STATUS" type="java.lang.Short"
	 *                     length="5" not-null="false" unique="false"
	 */
	public Short getUsingStatus() {
		return this.usingStatus;
	}

	/**
	 * Set the usingStatus
	 */
	public void setUsingStatus(Short aValue) {
		this.usingStatus = aValue;
	}

	public String getDistance() {
		return distance;
	}

	public void setDistance(String distance) {
		this.distance = distance;
	}

	public String getEngineSpec() {
		return engineSpec;
	}

	public void setEngineSpec(String engineSpec) {
		this.engineSpec = engineSpec;
	}

	public String getPurchase() {
		return purchase;
	}

	public void setPurchase(String purchase) {
		this.purchase = purchase;
	}

	public String getIsPublic() {
		return isPublic;
	}

	public void setIsPublic(String isPublic) {
		this.isPublic = isPublic;
	}

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof Car)) {
			return false;
		}
		Car rhs = (Car) object;
		return new EqualsBuilder().append(this.carid, rhs.carid)
				.append(this.carno, rhs.carno)
				.append(this.cartype, rhs.cartype)
				.append(this.engineno, rhs.engineno)
				.append(this.buyinsuretime, rhs.buyinsuretime)
				.append(this.audittime, rhs.audittime)
				.append(this.notes, rhs.notes)
				.append(this.factorymodel, rhs.factorymodel)
				.append(this.driver, rhs.driver)
				.append(this.buydate, rhs.buydate)
				.append(this.status, rhs.status)
				.append(this.cartimage, rhs.cartimage)
				.append(this.purpose, rhs.purpose)
				.append(this.carClass, rhs.carClass)
				.append(this.passAmount, rhs.passAmount)
				.append(this.belongDeptId, rhs.belongDeptId)
				.append(this.usingStatus, rhs.usingStatus)
				.append(this.distance, rhs.distance)
				.append(this.engineSpec, rhs.engineSpec)
				.append(this.purchase, rhs.purchase)
				.append(this.isPublic, rhs.isPublic)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.carid)
				.append(this.carno).append(this.cartype).append(this.engineno)
				.append(this.buyinsuretime).append(this.audittime)
				.append(this.notes).append(this.factorymodel)
				.append(this.driver).append(this.buydate).append(this.status)
				.append(this.cartimage).append(this.purpose)
				.append(this.carClass).append(this.passAmount)
				.append(this.belongDeptId).append(this.usingStatus)
				.append(distance).append(engineSpec).append(purchase)
				.append(isPublic).append(this.createDate)
				.append(this.createBy).append(this.updateDate)
				.append(this.updateBy).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("carid", this.carid)
				.append("carno", this.carno).append("cartype", this.cartype)
				.append("engineno", this.engineno)
				.append("buyinsuretime", this.buyinsuretime)
				.append("audittime", this.audittime)
				.append("notes", this.notes)
				.append("factorymodel", this.factorymodel)
				.append("driver", this.driver).append("buydate", this.buydate)
				.append("status", this.status)
				.append("cartimage", this.cartimage)
				.append("purpose", this.purpose)
				.append("carClass", this.carClass)
				.append("passAmount", this.passAmount)
				.append("belongDeptId", this.belongDeptId)
				.append("usingStatus", this.usingStatus)
				.append(distance, this.distance)
				.append(engineSpec, this.engineSpec)
				.append(purchase, this.purchase)
				.append(isPublic, this.isPublic)
				.append("createDate", this.createDate)
				.append("createBy", this.createBy)
				.append("updateDate", this.updateDate)
				.append("updateBy", this.updateBy).toString();
	}

}

package com.gdssoft.oa.model.mileages;

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
public class Mileages extends com.gdssoft.core.model.BaseModel {

	protected Long id;
	protected String carno;
	protected java.util.Date travelDate;
	protected String endNumber;
	protected String monthMileage;
	protected java.util.Date createDate;
	protected String createUser;
	protected java.util.Date updateDate;
	protected String updateUser;
	protected com.gdssoft.oa.model.admin.Car car;
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCarno() {
		return carno;
	}

	public void setCarno(String carno) {
		this.carno = carno;
	}

	public com.gdssoft.oa.model.admin.Car getCar() {
		return car;
	}

	public void setCar(com.gdssoft.oa.model.admin.Car car) {
		this.car = car;
	}

	public Long getCarId() {
		return this.getCar() == null ? null : this.getCar().getCarid();
	}

	public void setCarId(Long aValue) {
		if (aValue == null) {
			car = null;
		} else if (car == null) {
			car = new com.gdssoft.oa.model.admin.Car(aValue);
			car.setVersion(new Integer(0));// set a version to cheat hibernate
			// only
		} else {
			car.setCarid(aValue);
		}
	}

	public java.util.Date getTravelDate() {
		return travelDate;
	}

	public void setTravelDate(java.util.Date travelDate) {
		this.travelDate = travelDate;
	}

	public String getEndNumber() {
		return endNumber;
	}

	public void setEndNumber(String endNumber) {
		this.endNumber = endNumber;
	}

	public String getMonthMileage() {
		return monthMileage;
	}

	public void setMonthMileage(String monthMileage) {
		this.monthMileage = monthMileage;
	}

	public java.util.Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public java.util.Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(java.util.Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof Mileages)) {
			return false;
		}
		Mileages rhs = (Mileages) object;
		return new EqualsBuilder().append(this.id, rhs.id)
				.append(this.createDate, rhs.createDate)
				.append(this.createUser, rhs.createUser)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateUser, rhs.updateUser).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.id)
				.append(this.travelDate)
				.append(this.endNumber).append(this.monthMileage)
				.append(this.createDate).append(this.createUser)
				.append(this.updateDate).append(this.updateUser).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("id", this.id)
				.append("travelDate", this.travelDate)
				.append("endNumber",this.endNumber)
				.append("monthileage",this.monthMileage)
				.append("createDate", this.createDate)
				.append("createBy", this.createUser)
				.append("updateDate", this.updateDate)
				.append("updateBy", this.updateUser).toString();
	}

}

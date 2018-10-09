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
 * CarUsing Base Java Bean, base class for the.oa.model, mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 * 
 */
public class CarUsing extends com.gdssoft.core.model.BaseModel {
	@Expose
	protected Long id;
	@Expose
	protected java.util.Date leavingDt;
	@Expose
	protected java.util.Date comingDt;
	@Expose
	protected String distance;
	@Expose
	protected String passFee;
	@Expose
	protected String parkFee;
	@Expose
	protected String otherFee;
	@Expose
	protected String feeAmount;
	@Expose
	protected Long feeId;
	@Expose
	protected java.util.Date createDate;
	@Expose
	protected String createBy;
	@Expose
	protected java.util.Date updateDate;
	@Expose
	protected String updateBy;
	@Expose
	protected String driver;// 新增字段 司机
	@Expose
	protected String des;// 新增字段 费用说明

	protected com.gdssoft.oa.model.admin.Car car;
	protected com.gdssoft.oa.model.admin.CarApply carApply;
	protected com.gdssoft.oa.model.admin.CarDriver carDriver;
	//protected com.gdssoft.oa.model.admin.CarOilCard carOilCard;
	//protected com.gdssoft.oa.model.admin.CarPassFeeCard carPassFeeCard;

	/**
	 * Default Empty Constructor for class CarUsing
	 */
	public CarUsing() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class CarUsing
	 */
	public CarUsing(Long in_id) {
		this.setId(in_id);
	}

	public com.gdssoft.oa.model.admin.Car getCar() {
		return car;
	}

	public void setCar(com.gdssoft.oa.model.admin.Car in_car) {
		this.car = in_car;
	}

	public com.gdssoft.oa.model.admin.CarApply getCarApply() {
		return carApply;
	}

	public void setCarApply(com.gdssoft.oa.model.admin.CarApply in_carApply) {
		this.carApply = in_carApply;
	}

	public com.gdssoft.oa.model.admin.CarDriver getCarDriver() {
		return carDriver;
	}

	public void setCarDriver(com.gdssoft.oa.model.admin.CarDriver in_carDriver) {
		this.carDriver = in_carDriver;
	}

	/*public com.gdssoft.oa.model.admin.CarOilCard getCarOilCard() {
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
*/
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
	 * * @return Long
	 */
	public Long getApplyId() {
		return this.getCarApply() == null ? null : this.getCarApply()
				.getApplyId();
	}

	/**
	 * Set the applyId
	 */
	public void setApplyId(Long aValue) {
		if (aValue == null) {
			carApply = null;
		} else if (carApply == null) {
			carApply = new com.gdssoft.oa.model.admin.CarApply(aValue);
			carApply.setVersion(new Integer(0));// set a version to cheat
			// hibernate only
		} else {
			carApply.setApplyId(aValue);
		}
	}

	/**
	 * * @return Long
	 */
	public Long getCarId() {
		return this.getCar() == null ? null : this.getCar().getCarid();
	}

	/**
	 * Set the carId
	 */
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

	/**
	 * * @return Long
	 */
	public Long getDriverId() {
		return this.getCarDriver() == null ? null : this.getCarDriver().getId();
	}

	/**
	 * Set the driverId
	 */
	public void setDriverId(Long aValue) {
		if (aValue == null) {
			carDriver = null;
		} else if (carDriver == null) {
			carDriver = new com.gdssoft.oa.model.admin.CarDriver(aValue);
			carDriver.setVersion(new Integer(0));// set a version to cheat
			// hibernate only
		} else {
			carDriver.setId(aValue);
		}
	}

/*	*//**
	 * * @return Long
	 *//*
	public Long getOilCardId() {
		// return this.getCarOilCard()==null?null:this.getCarOilCard().getId();
		return this.getCarOilCard() == null ? null : this.getCarOilCard()
				.getId();
	}
*/
	/**
	 * Set the oilCardId
	 *//*
	public void setOilCardId(Long aValue) {
		if (aValue == null) {
			carOilCard = null;
		} else if (carOilCard == null) {
			carOilCard = new com.gdssoft.oa.model.admin.CarOilCard(aValue);
			carOilCard.setVersion(new Integer(0));// set a version to cheat
			// hibernate only
		} else {
			// carOilCard.setOilCardId(aValue);
			carOilCard.setId(aValue);
		}
	}*/
/*
	*//**
	 * * @return Long
	 *//*
	public Long getPayCardId() {
		// return
		// this.getCarPassFeeCard()==null?null:this.getCarPassFeeCard().getPayCardId();
		return this.getCarPassFeeCard() == null ? null : this
				.getCarPassFeeCard().getId();
	}*/

/*	*//**
	 * Set the payCardId
	 *//*
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
	}*/

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="LEAVING_DT" type="java.util.Date" length="23"
	 *                     not-null="true" unique="false"
	 */
	public java.util.Date getLeavingDt() {
		return this.leavingDt;
	}

	/**
	 * Set the leavingDt
	 * 
	 * @spring.validator type="required"
	 */
	public void setLeavingDt(java.util.Date aValue) {
		this.leavingDt = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="COMING_DT" type="java.util.Date" length="23"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getComingDt() {
		return this.comingDt;
	}

	/**
	 * Set the comingDt
	 */
	public void setComingDt(java.util.Date aValue) {
		this.comingDt = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="DISTANCE" type="java.lang.String" length="18"
	 *                     not-null="false" unique="false"
	 */
	public String getDistance() {
		return this.distance;
	}

	/**
	 * Set the distance
	 */
	public void setDistance(String aValue) {
		this.distance = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="PASS_FEE" type="java.lang.String" length="18"
	 *                     not-null="false" unique="false"
	 */
	public String getPassFee() {
		return this.passFee;
	}

	/**
	 * Set the passFee
	 */
	public void setPassFee(String aValue) {
		this.passFee = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="PARK_FEE" type="java.lang.String" length="18"
	 *                     not-null="false" unique="false"
	 */
	public String getParkFee() {
		return this.parkFee;
	}

	/**
	 * Set the parkFee
	 */
	public void setParkFee(String aValue) {
		this.parkFee = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="OTHER_FEE" type="java.lang.String"
	 *                     length="18" not-null="false" unique="false"
	 */
	public String getOtherFee() {
		return this.otherFee;
	}

	/**
	 * Set the otherFee
	 */
	public void setOtherFee(String aValue) {
		this.otherFee = aValue;
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.property column="FEE_AMOUNT" type="java.lang.Long" length="19"
	 *                     not-null="false" unique="false"
	 */
	public String getFeeAmount() {
		return this.feeAmount;
	}

	/**
	 * Set the feeAmount
	 */
	public void setFeeAmount(String aValue) {
		this.feeAmount = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="FEE_ID" type="java.lang.String" length="18"
	 *                     not-null="false" unique="false"
	 */
	public Long getFeeId() {
		return this.feeId;
	}

	/**
	 * Set the feeId
	 */
	public void setFeeId(Long aValue) {
		this.feeId = aValue;
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

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public String getDes() {
		return des;
	}

	public void setDes(String des) {
		this.des = des;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof CarUsing)) {
			return false;
		}
		CarUsing rhs = (CarUsing) object;
		return new EqualsBuilder().append(this.id, rhs.id).append(
				this.leavingDt, rhs.leavingDt).append(this.comingDt,
				rhs.comingDt).append(this.distance, rhs.distance).append(
				this.passFee, rhs.passFee).append(this.parkFee, rhs.parkFee)
				.append(this.otherFee, rhs.otherFee).append(this.feeAmount,
						rhs.feeAmount).append(this.feeId, rhs.feeId).append(
						this.createDate, rhs.createDate).append(this.createBy,
						rhs.createBy).append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.id)
				.append(this.leavingDt).append(this.comingDt).append(
						this.distance).append(this.passFee)
				.append(this.parkFee).append(this.otherFee).append(
						this.feeAmount).append(this.feeId).append(
						this.createDate).append(this.createBy).append(
						this.updateDate).append(this.updateBy).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("id", this.id).append(
				"leavingDt", this.leavingDt).append("comingDt", this.comingDt)
				.append("distance", this.distance).append("passFee",
						this.passFee).append("parkFee", this.parkFee).append(
						"otherFee", this.otherFee).append("feeAmount",
						this.feeAmount).append("feeId", this.feeId).append(
						"createDate", this.createDate).append("createBy",
						this.createBy).append("updateDate", this.updateDate)
				.append("updateBy", this.updateBy).append("car",
						car != null ? car.toString() : "").toString();
	}

}

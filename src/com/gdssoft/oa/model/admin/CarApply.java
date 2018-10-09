package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.google.gson.annotations.Expose;

/**
 * CarApply Base Java Bean, base class for the.oa.model, mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 */
public class CarApply extends com.gdssoft.core.model.BaseModel {
	public static Short PASS_APPLY = 1;// 通过审批
	public static Short NOTPASS_APPLY = 2;// 未通过审批
	public static Short INIT_APPLY = 0;// 尚未审批
	
	public static final Short 	NOT_DISTRIBUTE=1;//未分配
	public static final Short   HAS_DISTRIBUTE=2;//已经分配
	public static final Short   HAS_RECEIVED=3;//已收车
	public static final Short   NO_RESOURCES=4;//没有资源
	
	@Expose
	protected Long applyId;
	@Expose
	protected String department;
	@Expose
	protected String userFullname;
	@Expose
	protected java.util.Date applyDate;
	@Expose
	protected String reason;
	@Expose
	protected java.util.Date startTime;
	@Expose
	protected java.util.Date endTime;
	@Expose
	protected String onDutyTime;// 开始时间
	@Expose
	protected String offDutyTime;// 结束时间
	@Expose
	protected String proposer;
	@Expose
	protected Long userId;
	@Expose
	protected java.math.BigDecimal mileage;
	@Expose
	protected java.math.BigDecimal oilUse;
	@Expose
	protected String notes;
	@Expose
	protected String fromSite;// 出发地点
	@Expose
	protected String toSite;// 目的地
	@Expose
	protected String driver;
	@Expose
	protected Long driverId;
	@Expose
	protected Short approvalStatus;// 审批状态 2:审批中,1:通过审批，3:终止流程
	@Expose
	protected Short ishavecardriver;// 是否需要司机 1:需要司机，2:不需要
	@Expose
	protected Short iseffective;// 是否长期有效 1:不是 2:长期有效
	@Expose
	protected Short status;// 是否已分配 1:否 2:是 3:已收车
	@Expose
	protected Short status2;// 是否已分配 1:否 2:是 3:已收车
	@Expose
	protected String carNo;
	@Expose
	protected Short peopleAmount;// 可承载人数
	@Expose
	protected java.util.Date createDate;
	@Expose
	protected String createBy;
	@Expose
	protected java.util.Date updateDate;
	@Expose
	protected String updateBy;
	@Expose
	protected Short carAmount;// 收车的数量
	@Expose
	protected Float totalDistance;// 总里程
	@Expose
	protected Float totalAmount;// 总费用
	@Expose
	protected Long operatorId;//经办人Id
	@Expose
	protected String carType;//经办人Id
	@Expose
	protected com.gdssoft.oa.model.admin.Car car;
	protected com.gdssoft.oa.model.flow.ProcessRun processRun;
	
	protected TaskImpl task;



	public String getCarType() {
		return carType;
	}

	public void setCarType(String carType) {
		this.carType = carType;
	}

	protected Set<Car> cars = new HashSet<Car>();
	@Expose
	protected Set<CarDriver> carDrivers = new HashSet<CarDriver>();
	@Expose
	private String carIds;
	@Expose
	private String driverIds;

	public Float getTotalDistance() {
		return totalDistance;
	}

	public Long getOperatorId() {
		return operatorId;
	}

	public void setOperatorId(Long operatorId) {
		this.operatorId = operatorId;
	}

	public void setTotalDistance(Float totalDistance) {
		this.totalDistance = totalDistance;
	}

	public Float getTotalAmount() {
		return totalAmount;
	}

	public void setTotalAmount(Float totalAmount) {
		this.totalAmount = totalAmount;
	}

	/**
	 * Default Empty Constructor for class CarApply
	 */
	public CarApply() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class CarApply
	 */
	public CarApply(Long in_applyId) {
		this.setApplyId(in_applyId);
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}


	public Set<CarDriver> getCarDrivers() {
		return carDrivers;
	}

	public void setCarDrivers(Set<CarDriver> carDrivers) {
		this.carDrivers = carDrivers;
	}

	public com.gdssoft.oa.model.admin.Car getCar() {
		return car;
	}

	public void setCar(com.gdssoft.oa.model.admin.Car in_car) {
		this.car = in_car;
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.id column="applyId" type="java.lang.Long"
	 *               generator-class="native"
	 */
	public Long getApplyId() {
		return this.applyId;
	}

	/**
	 * Set the applyId
	 */
	public void setApplyId(Long aValue) {
		this.applyId = aValue;
	}

	/**
	 * * @return Long
	 */
	public Long getCarId() {
		return this.getCar() == null ? null : this.getCar().getCarid();
	}

	public String getDriverIds() {
		return driverIds;
	}

	public void setDriverIds(String driverIds) {
		this.driverIds = driverIds;
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
	 * * @return String
	 * 
	 * @hibernate.property column="department" type="java.lang.String"
	 *                     length="64" not-null="true" unique="false"
	 */
	public String getDepartment() {
		return this.department;
	}

	/**
	 * Set the department
	 * 
	 * @spring.validator type="required"
	 */
	public void setDepartment(String aValue) {
		this.department = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="userFullname" type="java.lang.String"
	 *                     length="32" not-null="true" unique="false"
	 */
	public String getUserFullname() {
		return this.userFullname;
	}

	/**
	 * Set the userFullname
	 * 
	 * @spring.validator type="required"
	 */
	public void setUserFullname(String aValue) {
		this.userFullname = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="applyDate" type="java.util.Date" length="10"
	 *                     not-null="true" unique="false"
	 */
	public java.util.Date getApplyDate() {
		return this.applyDate;
	}

	/**
	 * Set the applyDate
	 * 
	 * @spring.validator type="required"
	 */
	public void setApplyDate(java.util.Date aValue) {
		this.applyDate = aValue;
	}

	public String getFromSite() {
		return fromSite;
	}

	public void setFromSite(String fromSite) {
		this.fromSite = fromSite;
	}

	public String getToSite() {
		return toSite;
	}

	public void setToSite(String toSite) {
		this.toSite = toSite;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="reason" type="java.lang.String" length="512"
	 *                     not-null="true" unique="false"
	 */
	public String getReason() {
		return this.reason;
	}

	/**
	 * Set the reason
	 * 
	 * @spring.validator type="required"
	 */
	public void setReason(String aValue) {
		this.reason = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="startTime" type="java.util.Date" length="19"
	 *                     not-null="true" unique="false"
	 */
	public java.util.Date getStartTime() {
		return this.startTime;
	}

	/**
	 * Set the startTime
	 * 
	 * @spring.validator type="required"
	 */
	public void setStartTime(java.util.Date aValue) {
		this.startTime = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="endTime" type="java.util.Date" length="19"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getEndTime() {
		return this.endTime;
	}

	/**
	 * Set the endTime
	 */
	public void setEndTime(java.util.Date aValue) {
		this.endTime = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="proposer" type="java.lang.String" length="32"
	 *                     not-null="true" unique="false"
	 */
	public String getProposer() {
		return this.proposer;
	}

	/**
	 * Set the proposer
	 * 
	 * @spring.validator type="required"
	 */
	public void setProposer(String aValue) {
		this.proposer = aValue;
	}

	/**
	 * * @return java.math.BigDecimal
	 * 
	 * @hibernate.property column="mileage" type="java.math.BigDecimal"
	 *                     length="18" not-null="false" unique="false"
	 */
	public java.math.BigDecimal getMileage() {
		return this.mileage;
	}

	/**
	 * Set the mileage
	 */
	public void setMileage(java.math.BigDecimal aValue) {
		this.mileage = aValue;
	}

	/**
	 * * @return java.math.BigDecimal
	 * 
	 * @hibernate.property column="oilUse" type="java.math.BigDecimal"
	 *                     length="18" not-null="false" unique="false"
	 */
	public java.math.BigDecimal getOilUse() {
		return this.oilUse;
	}

	/**
	 * Set the oilUse
	 */
	public void setOilUse(java.math.BigDecimal aValue) {
		this.oilUse = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="notes" type="java.lang.String" length="128"
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

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="approvalStatus" type="java.lang.Short"
	 *                     length="5" not-null="true" unique="false"
	 */
	public Short getApprovalStatus() {
		return this.approvalStatus;
	}

	/**
	 * Set the approvalStatus
	 * 
	 * @spring.validator type="required"
	 */
	public void setApprovalStatus(Short aValue) {
		this.approvalStatus = aValue;
	}

	public Short getIshavecardriver() {
		return ishavecardriver;
	}

	public void setIshavecardriver(Short ishavecardriver) {
		this.ishavecardriver = ishavecardriver;
	}

	public Short getIseffective() {
		return iseffective;
	}

	public void setIseffective(Short iseffective) {
		this.iseffective = iseffective;
	}

	public String getCarNo() {
		return carNo;
	}

	public void setCarNo(String carNo) {
		this.carNo = carNo;
	}

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public Long getDriverId() {
		return driverId;
	}

	public void setDriverId(Long driverId) {
		this.driverId = driverId;
	}

	public String getOnDutyTime() {
		return onDutyTime;
	}

	public void setOnDutyTime(String onDutyTime) {
		this.onDutyTime = onDutyTime;
	}

	public String getOffDutyTime() {
		return offDutyTime;
	}

	public void setOffDutyTime(String offDutyTime) {
		this.offDutyTime = offDutyTime;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Short getStatus2() {
		return status2;
	}

	public void setStatus2(Short status2) {
		this.status2 = status2;
	}

	public Short getPeopleAmount() {
		return peopleAmount;
	}

	public void setPeopleAmount(Short peopleAmount) {
		this.peopleAmount = peopleAmount;
	}

	public java.util.Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public java.util.Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(java.util.Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}

	public com.gdssoft.oa.model.flow.ProcessRun getProcessRun() {
		return processRun;
	}

	public void setProcessRun(com.gdssoft.oa.model.flow.ProcessRun processRun) {
		this.processRun = processRun;
	}

	public Set<Car> getCars() {
		return cars;
	}

	public void setCars(Set<Car> cars) {
		this.cars = cars;
	}


	public String getCarIds() {
		return carIds;
	}

	public void setCarIds(String carIds) {
		this.carIds = carIds;
	}

	public Short getCarAmount() {
		return carAmount;
	}

	public void setCarAmount(Short carAmount) {
		this.carAmount = carAmount;
	}
	public TaskImpl getTask() {
		return task;
	}

	public void setTask(TaskImpl task) {
		this.task = task;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof CarApply)) {
			return false;
		}
		CarApply rhs = (CarApply) object;
		return new EqualsBuilder().append(this.applyId, rhs.applyId).append(
				this.department, rhs.department).append(this.userFullname,
				rhs.userFullname).append(this.applyDate, rhs.applyDate).append(
				this.reason, rhs.reason).append(this.startTime, rhs.startTime)
				.append(this.endTime, rhs.endTime).append(this.proposer,
						rhs.proposer).append(this.userId, rhs.userId).append(
						this.mileage, rhs.mileage).append(this.oilUse,
						rhs.oilUse).append(this.notes, rhs.notes).append(
						this.approvalStatus, rhs.approvalStatus).append(
						this.iseffective, rhs.iseffective).append(
						this.ishavecardriver, rhs.ishavecardriver).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.applyId)
				.append(this.department).append(this.userFullname).append(
						this.applyDate).append(this.reason).append(
						this.startTime).append(this.endTime).append(
						this.proposer).append(this.userId).append(this.mileage)
				.append(this.oilUse).append(this.notes).append(
						this.approvalStatus).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("applyId", this.applyId)
				.append("department", this.department).append("userFullname",
						this.userFullname).append("applyDate", this.applyDate)
				.append("reason", this.reason).append("startTime",
						this.startTime).append("endTime", this.endTime).append(
						"proposer", this.proposer)
				.append("userId", this.userId).append("mileage", this.mileage)
				.append("oilUse", this.oilUse).append("notes", this.notes)
				.append("approvalStatus", this.approvalStatus).append(
						"ishavecardriver", this.ishavecardriver).append(
						"iseffective", this.iseffective).append("onDutyTime",
						this.onDutyTime)
				.append("offDutyTime", this.offDutyTime).toString();
	}

}

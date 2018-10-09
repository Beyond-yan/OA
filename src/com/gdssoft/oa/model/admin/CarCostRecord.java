package com.gdssoft.oa.model.admin;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.gdssoft.core.model.BaseModel;
import com.sun.org.apache.bcel.internal.generic.NEW;

public class CarCostRecord extends BaseModel {
	
	protected String typeName;

	protected Long id;//车辆费用记录id
	
	protected Float itemQty;//消费物品的总数量
	
	protected Float totalAmt;//消费物品的总金额
	
	protected Float unitPrice;//消费物品的单价
	
	protected String costComment;//消费备注
	
	protected Date costDate;//车辆消费日期
	
	protected Date createTime;//創建時間
		
	protected Date updateTime;//更新時間
		
	protected String createUser;//創建人
		
	protected String updateUser;//更新人
	
	protected Car car;//车辆

	protected CarDriver carDriver;//经办人
	
	protected CarCostType costType;//费用类别
	
	
	
	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public Float getItemQty() {
		return itemQty;
	}

	public void setItemQty(Float itemQty) {
		this.itemQty = itemQty;
	}

	protected Set<CarCostRecordDetail> carCostRecordDetails=new HashSet<CarCostRecordDetail>();
	
	
	
	public Set<CarCostRecordDetail> getCarCostRecordDetails() {
		return carCostRecordDetails;
	}

	public void setCarCostRecordDetails(
			Set<CarCostRecordDetail> carCostRecordDetails) {
		this.carCostRecordDetails = carCostRecordDetails;
	}

	public Car getCar() {
		return car;
	}

	public void setCar(Car car) {
		this.car = car;
	}

	public CarDriver getCarDriver() {
		return carDriver;
	}

	public void setCarDriver(CarDriver carDriver) {
		this.carDriver = carDriver;
	}

	public CarCostType getCostType() {
		return costType;
	}

	public void setCostType(CarCostType costType) {
		this.costType = costType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getCostDate() {
		return costDate;
	}

	public void setCostDate(Date costDate) {
		this.costDate = costDate;
	}

	public Float getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(Float totalAmt) {
		this.totalAmt = totalAmt;
	}

	public Float getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(Float unitPrice) {
		this.unitPrice = unitPrice;
	}

	public String getCostComment() {
		return costComment;
	}

	public void setCostComment(String costComment) {
		this.costComment = costComment;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
	
	
	
}

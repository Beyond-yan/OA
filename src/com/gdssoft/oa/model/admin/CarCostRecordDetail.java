package com.gdssoft.oa.model.admin;

import java.util.Date;

import com.gdssoft.core.model.BaseModel;

public class CarCostRecordDetail extends BaseModel {

	protected Long id;//车辆费用详细id
	
	protected Float costPrice;//消费金额
	
	protected String costName;//消费名称
		
	protected Date createTime;//創建時間
		
	protected Date updateTime;//更新時間
		
	protected String createUser;//創建人
		
	protected String updateUser;//更新人
	
	protected CarCostRecord carCostRecord;//费用记录单

	
	public CarCostRecord getCarCostRecord() {
		return carCostRecord;
	}

	public void setCarCostRecord(CarCostRecord carCostRecord) {
		this.carCostRecord = carCostRecord;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public Float getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(Float costPrice) {
		this.costPrice = costPrice;
	}

	public String getCostName() {
		return costName;
	}

	public void setCostName(String costName) {
		this.costName = costName;
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

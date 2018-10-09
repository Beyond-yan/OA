package com.gdssoft.oa.model.admin;

import java.util.Date;

import com.gdssoft.core.model.BaseModel;

public class CarCostType extends BaseModel {

	protected Long id;//车辆费用类别id
	
	protected String costTypeName;//消费类别名称
	
	protected String costNo;//类别ID（非数据库中的id）
		
	protected Date createTime;//創建時間
		
	protected Date updateTime;//更新時間
		
	protected String createUser;//創建人
		
	protected String updateUser;//更新人

	
	
	public String getCostNo() {
		return costNo;
	}

	public void setCostNo(String costNo) {
		this.costNo = costNo;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


	public String getCostTypeName() {
		return costTypeName;
	}

	public void setCostTypeName(String costTypeName) {
		this.costTypeName = costTypeName;
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

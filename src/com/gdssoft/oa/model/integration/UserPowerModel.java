package com.gdssoft.oa.model.integration;

public class UserPowerModel extends BaseModel{
	private int poweId;
	private String poweUserId;
	private String poweUserName;
	private String poweDeptName;
	private String poweItemKey;
	private String relationUser;
	
	public String getRelationUser() {
		return relationUser;
	}
	public void setRelationUser(String relationUser) {
		this.relationUser = relationUser;
	}
	public int getPoweId() {
		return poweId;
	}
	public void setPoweId(int poweId) {
		this.poweId = poweId;
	}
	public String getPoweUserId() {
		return poweUserId;
	}
	public void setPoweUserId(String poweUserId) {
		this.poweUserId = poweUserId;
	}
	public String getPoweUserName() {
		return poweUserName;
	}
	public void setPoweUserName(String poweUserName) {
		this.poweUserName = poweUserName;
	}
	public String getPoweDeptName() {
		return poweDeptName;
	}
	public void setPoweDeptName(String poweDeptName) {
		this.poweDeptName = poweDeptName;
	}
	public String getPoweItemKey() {
		return poweItemKey;
	}
	public void setPoweItemKey(String poweItemKey) {
		this.poweItemKey = poweItemKey;
	}
	
}

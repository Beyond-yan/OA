package com.gdssoft.oa.model.law;

import java.util.Date;

import com.gdssoft.core.model.BaseModel;

public class Laws extends BaseModel{
	//法律的id
	protected Long Id;
    //法律的類型
	//標題
	protected String title;
	//頒佈單位
	protected LawsAuthor lawsAuthor;
	
	protected LawsType lawsType;
	//內容
	protected String content;
	//時效性
	protected Long status;
	//頒佈日期
	protected Date publishDate;
	//實施日期
	protected Date implementDate;
	//創建時間
	protected Date createTime;
	//更新時間
	protected Date updateTime;
	//創建人
	protected String createUser;
	//更新人
	protected String updateUser;
	
	//構造函數
	public Laws(){
		super();
	}
	public Laws(Long in_id){
		this.setId(in_id);
	}
	
	public Long getId() {
		return Id;
	}
	public void setId(Long id) {
		Id = id;
	}
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Long getStatus() {
		return status;
	}
	public void setStatus(Long status) {
		this.status = status;
	}
	public Date getPublishDate() {
		return publishDate;
	}
	public void setPublishDate(Date publishDate) {
		this.publishDate = publishDate;
	}
	public Date getImplementDate() {
		return implementDate;
	}
	public void setImplementDate(Date implementDate) {
		this.implementDate = implementDate;
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
	
	public LawsAuthor getLawsAuthor() {
		return lawsAuthor;
	}
	public void setLawsAuthor(LawsAuthor lawsAuthor) {
		this.lawsAuthor = lawsAuthor;
	}
	public LawsType getLawsType() {
		return lawsType;
	}
	public void setLawsType(LawsType lawsType) {
		this.lawsType = lawsType;
	}
	
	
}

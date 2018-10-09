package com.gdssoft.oa.model.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/



import java.util.Set;

import com.google.gson.annotations.Expose;
import com.gdssoft.core.model.BaseModel;

public class NewsType extends BaseModel {
	@Expose
	private Long typeId;
	@Expose
	private String typeName;
	@Expose
	private Short sn;
	
	private Set<News> news;
	public NewsType() {
		// TODO Auto-generated constructor stub
	}
	public Long getTypeId() {
		return typeId;
	}
	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public Short getSn() {
		return sn;
	}
	public void setSn(Short sn) {
		this.sn = sn;
	}
	public Set<News> getNews() {
		return news;
	}
	public void setNews(Set<News> news) {
		this.news = news;
	}
	
	
}

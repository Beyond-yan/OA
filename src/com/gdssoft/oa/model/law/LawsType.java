package com.gdssoft.oa.model.law;

import java.util.Set;

import com.gdssoft.core.model.BaseModel;

public class LawsType extends BaseModel {

	//内容分类id
	private Long typeId;
	//内容分类名称
	private String typeName;
	//与法规对应的列表
	private Set<Laws> laws;
	
	//构造函数
	public LawsType(){
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
	public Set<Laws> getLaws() {
		return laws;
	}
	public void setLaws(Set<Laws> laws) {
		this.laws = laws;
	}
	
}

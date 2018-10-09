package com.gdssoft.oa.model.law;

import java.util.Date;
import java.util.Set;

import com.gdssoft.core.model.BaseModel;

public class LawsAuthor extends BaseModel {

	
	private Long authorId;
	
	private String authorName;
	
	/*private String authorLevel;
	
	private String createUser;
	
	private Date createDate;
	
	private String updateUser;
	
	private Date updateDate;*/
	
	private Set<Laws> laws;
	
	//构造函数
	public LawsAuthor(){
	}
	
	public Long getAuthorId() {
		return authorId;
	}

	public void setAuthorId(Long authorId) {
		this.authorId = authorId;
	}

	public String getAuthorName() {
		return authorName;
	}

	public void setAuthorName(String authorName) {
		this.authorName = authorName;
	}

/*	public String getAuthorLevel() {
		return authorLevel;
	}

	public void setAuthorLevel(String authorLevel) {
		this.authorLevel = authorLevel;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
*/
	public Set<Laws> getLaws() {
		return laws;
	}
	public void setLaws(Set<Laws> laws) {
		this.laws = laws;
	}
	
}

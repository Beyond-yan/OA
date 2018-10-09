package com.gdssoft.oa.model.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * JwArchives Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class JwArchives extends com.gdssoft.core.model.BaseModel {

    protected Long id;
    //文件标题
	protected String subject;
	//所属部门
	protected String sourcedepartment;
	//页数
	protected String page;
	//公文编号
	protected String docnum;
	//发文单位
	protected String burden;
	//收发类型
	protected String doctype;
	//文件日期
	protected String day;
	//密级
	protected String securitydegree;
	
	//年份
	protected String bumfyear;
	//关键词
	protected String keywords;
	protected String attachcode;
//用于搜索引擎的ID
	 protected String archiveid;
	 
	public String getArchiveid() {
		return archiveid;
	}

	public void setArchiveid(String archiveid) {
		this.archiveid = archiveid;
	}

	/**
	 * Default Empty Constructor for class JwArchives
	 */
	public JwArchives () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class JwArchives
	 */
	public JwArchives (
		 Long in_id
        ) {
		this.setId(in_id);
    }

    

	/**
	 * 	 * @return Long
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
	 * 	 * @return String
	 * @hibernate.property column="SUBJECT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getSubject() {
		return this.subject;
	}
	
	/**
	 * Set the subject
	 */	
	public void setSubject(String aValue) {
		this.subject = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SOURCEDEPARTMENT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getSourcedepartment() {
		return this.sourcedepartment;
	}
	
	/**
	 * Set the sourcedepartment
	 */	
	public void setSourcedepartment(String aValue) {
		this.sourcedepartment = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PAGE" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getPage() {
		return this.page;
	}
	
	/**
	 * Set the page
	 */	
	public void setPage(String aValue) {
		this.page = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DOCNUM" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDocnum() {
		return this.docnum;
	}
	
	/**
	 * Set the docnum
	 */	
	public void setDocnum(String aValue) {
		this.docnum = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="BURDEN" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getBurden() {
		return this.burden;
	}
	
	/**
	 * Set the burden
	 */	
	public void setBurden(String aValue) {
		this.burden = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DOCTYPE" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDoctype() {
		return this.doctype;
	}
	
	/**
	 * Set the doctype
	 */	
	public void setDoctype(String aValue) {
		this.doctype = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SECURITYDEGREE" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getSecuritydegree() {
		return this.securitydegree;
	}
	
	/**
	 * Set the securitydegree
	 */	
	public void setSecuritydegree(String aValue) {
		this.securitydegree = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DAY" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDay() {
		return this.day;
	}
	
	/**
	 * Set the day
	 */	
	public void setDay(String aValue) {
		this.day = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="BUMFYEAR" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getBumfyear() {
		return this.bumfyear;
	}
	
	/**
	 * Set the bumfyear
	 */	
	public void setBumfyear(String aValue) {
		this.bumfyear = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="KEYWORDS" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getKeywords() {
		return this.keywords;
	}
	
	/**
	 * Set the keywords
	 */	
	public void setKeywords(String aValue) {
		this.keywords = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ATTACHCODE" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getAttachcode() {
		return this.attachcode;
	}
	
	/**
	 * Set the attachcode
	 */	
	public void setAttachcode(String aValue) {
		this.attachcode = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof JwArchives)) {
			return false;
		}
		JwArchives rhs = (JwArchives) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.subject, rhs.subject)
				.append(this.sourcedepartment, rhs.sourcedepartment)
				.append(this.page, rhs.page)
				.append(this.docnum, rhs.docnum)
				.append(this.burden, rhs.burden)
				.append(this.doctype, rhs.doctype)
				.append(this.securitydegree, rhs.securitydegree)
				.append(this.day, rhs.day)
				.append(this.bumfyear, rhs.bumfyear)
				.append(this.keywords, rhs.keywords)
				.append(this.attachcode, rhs.attachcode)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.subject) 
				.append(this.sourcedepartment) 
				.append(this.page) 
				.append(this.docnum) 
				.append(this.burden) 
				.append(this.doctype) 
				.append(this.securitydegree) 
				.append(this.day) 
				.append(this.bumfyear) 
				.append(this.keywords) 
				.append(this.attachcode) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("subject", this.subject) 
				.append("sourcedepartment", this.sourcedepartment) 
				.append("page", this.page) 
				.append("docnum", this.docnum) 
				.append("burden", this.burden) 
				.append("doctype", this.doctype) 
				.append("securitydegree", this.securitydegree) 
				.append("day", this.day) 
				.append("bumfyear", this.bumfyear) 
				.append("keywords", this.keywords) 
				.append("attachcode", this.attachcode) 
				.toString();
	}



}

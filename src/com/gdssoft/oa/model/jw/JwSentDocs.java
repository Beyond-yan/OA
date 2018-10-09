package com.gdssoft.oa.model.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.google.gson.annotations.Expose;

/**
 * JwSentDocs Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class JwSentDocs extends com.gdssoft.core.model.BaseModel {

	//自增成长ID
    protected Long id;
    //处理笺名称
    @Expose
	protected String unittitle;
	//发文字号
    @Expose
	protected String docnum;
	//紧急程度
    @Expose
	protected String urgencydegree;
	//密级
    @Expose
	protected String securitydegree;
	//签发
    @Expose
	protected String signissuebody;
	//会签领导
	protected String signjointlybody;
	//主送单位
	@Expose
	protected String todept;
	//抄送单位
	@Expose
	protected String ccdept;
	//拟稿部门
	@Expose
	protected String composeunit;
	//拟稿人
	@Expose
	protected String composeuser;
	//核稿人
	protected String checkuser;
	//打印
	protected String printuser;
	//校稿
	protected String proofuser;
	//发文单位
	@Expose
	protected String dispatchunit;
	//文种
	@Expose
	protected String docclass;
	//行文方向
	@Expose
	protected String docway;
	//附件名称
	protected String attachfilename;
	//主题词
	@Expose
	protected String topic;
	//标题
	@Expose
	protected String subject;
	//附件编码
	protected String attachcode;
	@Expose
	 protected java.util.Set jwAttachfiles = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class JwSentDocs
	 */
	public JwSentDocs () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class JwSentDocs
	 */
	public JwSentDocs (
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
	 * @hibernate.property column="UNITTITLE" type="java.lang.String" length="3000" not-null="false" unique="false"
	 */
	public String getUnittitle() {
		return this.unittitle;
	}
	
	/**
	 * Set the unittitle
	 */	
	public void setUnittitle(String aValue) {
		this.unittitle = aValue;
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
	 * @hibernate.property column="URGENCYDEGREE" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getUrgencydegree() {
		return this.urgencydegree;
	}
	
	/**
	 * Set the urgencydegree
	 */	
	public void setUrgencydegree(String aValue) {
		this.urgencydegree = aValue;
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
	 * @hibernate.property column="SIGNISSUEBODY" type="java.lang.String" length="3000" not-null="false" unique="false"
	 */
	public String getSignissuebody() {
		return this.signissuebody;
	}
	
	/**
	 * Set the signissuebody
	 */	
	public void setSignissuebody(String aValue) {
		this.signissuebody = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SIGNJOINTLYBODY" type="java.lang.String" length="3000" not-null="false" unique="false"
	 */
	public String getSignjointlybody() {
		return this.signjointlybody;
	}
	
	/**
	 * Set the signjointlybody
	 */	
	public void setSignjointlybody(String aValue) {
		this.signjointlybody = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="TODEPT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getTodept() {
		return this.todept;
	}
	
	/**
	 * Set the todept
	 */	
	public void setTodept(String aValue) {
		this.todept = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CCDEPT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getCcdept() {
		return this.ccdept;
	}
	
	/**
	 * Set the ccdept
	 */	
	public void setCcdept(String aValue) {
		this.ccdept = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="COMPOSEUNIT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getComposeunit() {
		return this.composeunit;
	}
	
	/**
	 * Set the composeunit
	 */	
	public void setComposeunit(String aValue) {
		this.composeunit = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="COMPOSEUSER" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getComposeuser() {
		return this.composeuser;
	}
	
	/**
	 * Set the composeuser
	 */	
	public void setComposeuser(String aValue) {
		this.composeuser = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CHECKUSER" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getCheckuser() {
		return this.checkuser;
	}
	
	/**
	 * Set the checkuser
	 */	
	public void setCheckuser(String aValue) {
		this.checkuser = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PRINTUSER" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getPrintuser() {
		return this.printuser;
	}
	
	/**
	 * Set the printuser
	 */	
	public void setPrintuser(String aValue) {
		this.printuser = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PROOFUSER" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getProofuser() {
		return this.proofuser;
	}
	
	/**
	 * Set the proofuser
	 */	
	public void setProofuser(String aValue) {
		this.proofuser = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DISPATCHUNIT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDispatchunit() {
		return this.dispatchunit;
	}
	
	/**
	 * Set the dispatchunit
	 */	
	public void setDispatchunit(String aValue) {
		this.dispatchunit = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DOCCLASS" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDocclass() {
		return this.docclass;
	}
	
	/**
	 * Set the docclass
	 */	
	public void setDocclass(String aValue) {
		this.docclass = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DOCWAY" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDocway() {
		return this.docway;
	}
	
	/**
	 * Set the docway
	 */	
	public void setDocway(String aValue) {
		this.docway = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ATTACHFILENAME" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getAttachfilename() {
		return this.attachfilename;
	}
	
	/**
	 * Set the attachfilename
	 */	
	public void setAttachfilename(String aValue) {
		this.attachfilename = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="TOPIC" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getTopic() {
		return this.topic;
	}
	
	/**
	 * Set the topic
	 */	
	public void setTopic(String aValue) {
		this.topic = aValue;
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

	public java.util.Set getJwAttachfiles() {
		return jwAttachfiles;
	}

	public void setJwAttachfiles(java.util.Set jwAttachfiles) {
		this.jwAttachfiles = jwAttachfiles;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof JwSentDocs)) {
			return false;
		}
		JwSentDocs rhs = (JwSentDocs) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.unittitle, rhs.unittitle)
				.append(this.docnum, rhs.docnum)
				.append(this.urgencydegree, rhs.urgencydegree)
				.append(this.securitydegree, rhs.securitydegree)
				.append(this.signissuebody, rhs.signissuebody)
				.append(this.signjointlybody, rhs.signjointlybody)
				.append(this.todept, rhs.todept)
				.append(this.ccdept, rhs.ccdept)
				.append(this.composeunit, rhs.composeunit)
				.append(this.composeuser, rhs.composeuser)
				.append(this.checkuser, rhs.checkuser)
				.append(this.printuser, rhs.printuser)
				.append(this.proofuser, rhs.proofuser)
				.append(this.dispatchunit, rhs.dispatchunit)
				.append(this.docclass, rhs.docclass)
				.append(this.docway, rhs.docway)
				.append(this.attachfilename, rhs.attachfilename)
				.append(this.topic, rhs.topic)
				.append(this.subject, rhs.subject)
				.append(this.attachcode, rhs.attachcode)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.unittitle) 
				.append(this.docnum) 
				.append(this.urgencydegree) 
				.append(this.securitydegree) 
				.append(this.signissuebody) 
				.append(this.signjointlybody) 
				.append(this.todept) 
				.append(this.ccdept) 
				.append(this.composeunit) 
				.append(this.composeuser) 
				.append(this.checkuser) 
				.append(this.printuser) 
				.append(this.proofuser) 
				.append(this.dispatchunit) 
				.append(this.docclass) 
				.append(this.docway) 
				.append(this.attachfilename) 
				.append(this.topic) 
				.append(this.subject) 
				.append(this.attachcode) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("unittitle", this.unittitle) 
				.append("docnum", this.docnum) 
				.append("urgencydegree", this.urgencydegree) 
				.append("securitydegree", this.securitydegree) 
				.append("signissuebody", this.signissuebody) 
				.append("signjointlybody", this.signjointlybody) 
				.append("todept", this.todept) 
				.append("ccdept", this.ccdept) 
				.append("composeunit", this.composeunit) 
				.append("composeuser", this.composeuser) 
				.append("checkuser", this.checkuser) 
				.append("printuser", this.printuser) 
				.append("proofuser", this.proofuser) 
				.append("dispatchunit", this.dispatchunit) 
				.append("docclass", this.docclass) 
				.append("docway", this.docway) 
				.append("attachfilename", this.attachfilename) 
				.append("topic", this.topic) 
				.append("subject", this.subject) 
				.append("attachcode", this.attachcode) 
				.toString();
	}



}

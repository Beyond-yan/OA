package com.gdssoft.oa.model.jw;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * JwReceivedDocs Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class JwReceivedDocs extends com.gdssoft.core.model.BaseModel {

	//Id
    protected Long id;
    //收文处理笺名称
	protected String unittitle;
	//收文编号
	protected String acceptno;
	//紧急程度
	protected String urgencydegree;
	//密级
	protected String securitydegree;
	//来文单位
	protected String fromunit;
	//标题
	protected String subject;
	//附件名称
	protected String attachfilename;
	//来文字号
	protected String docnum;
	//成文日期
	protected String dispatchdocdt;
	//签收人
	protected String signname;
	//主题词
	protected String topic;
	//主办部门
	protected String dept;
	//拟办意见
	protected String planmemo;
	//拟办人
	protected String planuser;
	//拟办日期
	protected String plandate;
	//领导批示意见
	protected String leadmemo;
	//批示领导
	protected String leadname;
	//批示日期
	protected String leaddt;
	//附件编码
	protected String attachcode;

    protected java.util.Set jwAttachfiles = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class JwReceivedDocs
	 */
	public JwReceivedDocs () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class JwReceivedDocs
	 */
	public JwReceivedDocs (
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
	 * @hibernate.property column="ACCEPTNO" type="java.lang.String" length="1000" not-null="false" unique="false"
	 */
	public String getAcceptno() {
		return this.acceptno;
	}
	
	/**
	 * Set the acceptno
	 */	
	public void setAcceptno(String aValue) {
		this.acceptno = aValue;
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
	 * @hibernate.property column="FROMUNIT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getFromunit() {
		return this.fromunit;
	}
	
	/**
	 * Set the fromunit
	 */	
	public void setFromunit(String aValue) {
		this.fromunit = aValue;
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
	 * @hibernate.property column="DISPATCHDOCDT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDispatchdocdt() {
		return this.dispatchdocdt;
	}
	
	/**
	 * Set the dispatchdocdt
	 */	
	public void setDispatchdocdt(String aValue) {
		this.dispatchdocdt = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="SIGNNAME" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getSignname() {
		return this.signname;
	}
	
	/**
	 * Set the signname
	 */	
	public void setSignname(String aValue) {
		this.signname = aValue;
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
	 * @hibernate.property column="DEPT" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getDept() {
		return this.dept;
	}
	
	/**
	 * Set the dept
	 */	
	public void setDept(String aValue) {
		this.dept = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PLANMEMO" type="java.lang.String" length="2000" not-null="false" unique="false"
	 */
	public String getPlanmemo() {
		return this.planmemo;
	}
	
	/**
	 * Set the planmemo
	 */	
	public void setPlanmemo(String aValue) {
		this.planmemo = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PLANUSER" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getPlanuser() {
		return this.planuser;
	}
	
	/**
	 * Set the planuser
	 */	
	public void setPlanuser(String aValue) {
		this.planuser = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PLANDATE" type="java.lang.String" length="500" not-null="false" unique="false"
	 */
	public String getPlandate() {
		return this.plandate;
	}
	
	/**
	 * Set the plandate
	 */	
	public void setPlandate(String aValue) {
		this.plandate = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="LEADMEMO" type="java.lang.String" length="2000" not-null="false" unique="false"
	 */
	public String getLeadmemo() {
		return this.leadmemo;
	}
	
	/**
	 * Set the leadmemo
	 */	
	public void setLeadmemo(String aValue) {
		this.leadmemo = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="LEADNAME" type="java.lang.String" length="4000" not-null="false" unique="false"
	 */
	public String getLeadname() {
		return this.leadname;
	}
	
	/**
	 * Set the leadname
	 */	
	public void setLeadname(String aValue) {
		this.leadname = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="LEADDT" type="java.lang.String" length="3000" not-null="false" unique="false"
	 */
	public String getLeaddt() {
		return this.leaddt;
	}
	
	/**
	 * Set the leaddt
	 */	
	public void setLeaddt(String aValue) {
		this.leaddt = aValue;
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
		if (!(object instanceof JwReceivedDocs)) {
			return false;
		}
		JwReceivedDocs rhs = (JwReceivedDocs) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.unittitle, rhs.unittitle)
				.append(this.acceptno, rhs.acceptno)
				.append(this.urgencydegree, rhs.urgencydegree)
				.append(this.securitydegree, rhs.securitydegree)
				.append(this.fromunit, rhs.fromunit)
				.append(this.subject, rhs.subject)
				.append(this.attachfilename, rhs.attachfilename)
				.append(this.docnum, rhs.docnum)
				.append(this.dispatchdocdt, rhs.dispatchdocdt)
				.append(this.signname, rhs.signname)
				.append(this.topic, rhs.topic)
				.append(this.dept, rhs.dept)
				.append(this.planmemo, rhs.planmemo)
				.append(this.planuser, rhs.planuser)
				.append(this.plandate, rhs.plandate)
				.append(this.leadmemo, rhs.leadmemo)
				.append(this.leadname, rhs.leadname)
				.append(this.leaddt, rhs.leaddt)
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
				.append(this.acceptno) 
				.append(this.urgencydegree) 
				.append(this.securitydegree) 
				.append(this.fromunit) 
				.append(this.subject) 
				.append(this.attachfilename) 
				.append(this.docnum) 
				.append(this.dispatchdocdt) 
				.append(this.signname) 
				.append(this.topic) 
				.append(this.dept) 
				.append(this.planmemo) 
				.append(this.planuser) 
				.append(this.plandate) 
				.append(this.leadmemo) 
				.append(this.leadname) 
				.append(this.leaddt) 
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
				.append("acceptno", this.acceptno) 
				.append("urgencydegree", this.urgencydegree) 
				.append("securitydegree", this.securitydegree) 
				.append("fromunit", this.fromunit) 
				.append("subject", this.subject) 
				.append("attachfilename", this.attachfilename) 
				.append("docnum", this.docnum) 
				.append("dispatchdocdt", this.dispatchdocdt) 
				.append("signname", this.signname) 
				.append("topic", this.topic) 
				.append("dept", this.dept) 
				.append("planmemo", this.planmemo) 
				.append("planuser", this.planuser) 
				.append("plandate", this.plandate) 
				.append("leadmemo", this.leadmemo) 
				.append("leadname", this.leadname) 
				.append("leaddt", this.leaddt) 
				.append("attachcode", this.attachcode) 
				.toString();
	}



}

package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Query;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.CallableStatementCreator;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.ArchivesDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.OdArchivescc;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.system.AppRole;

public class ArchivesDaoImpl extends BaseDaoImpl<Archives> implements ArchivesDao{

	Log log = LogFactory.getLog("ArchivesDaoImpl");
	
	public ArchivesDaoImpl() {
		super(Archives.class);
	}

	@Override
	public List<Archives> findByUserOrRole(Long userId, Set<AppRole> roles,
			PagingBean pb) {
		Iterator<AppRole> it=roles.iterator();
		StringBuffer sb=new StringBuffer();
		while(it.hasNext()){
			if(sb.length()>0){
				sb.append(",");
			}
			sb.append(it.next().getRoleId().toString());
		}
		StringBuffer hql=new StringBuffer("select distinct vo1 from Archives vo1,ArchDispatch vo2 where vo2.archives=vo1 and vo2.archUserType=2 and (vo2.userId=?");
		if(sb.length()>0){
			hql.append(" or vo2.disRoleId in ("+sb+")");
		}
		hql.append(") ");
		Object[] objs={userId};
		return findByHql(hql.toString(), objs,pb);
	}
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findArchives(short archiveType,short status,String startDate,String endDate){
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = "from Archives ar where ar.status = ? and ar.archType = ?";
		if(!StringUtils.isNotBlank(startDate))
			hql += " and ar.createtime>to_date('" + startDate + "','YYYY-MM-DD HH24:MI:SS') ";
		if(!StringUtils.isNotBlank(endDate))
			hql += " and ar.createtime<=to_date('" + endDate + "','YYYY-MM-DD HH24:MI:SS') ";
		Object[] objs = { status,archiveType};
		return this.findByHql(hql, objs);
	}
	
	public List<Archives> findArchives(String schema, Short isStandard, Short runStatus,
			String keywords, Long isComSetting, String electronicDocStartDate,
			String electronicDocEndDate) {
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != ContextUtil.getCurrentUser()){
    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
    			schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		String hql = "SELECT ar.* FROM " + schema + "Archives ar join " + schema + 
				"process_run pr on ar.PROCESS_INS_ID = pr.runId where  1=1 "
				+ " and ar.is_Standard = :isStandard "
				+ " and pr.runStatus = :runStatus "
				+ " and ar.keywords = :keywords "
				+ " and ar.content_format = :isComSetting ";
		if(StringUtils.isNotBlank(electronicDocStartDate))
			hql += " and ar.electronic_doc_date>to_date('" + electronicDocStartDate + "','YYYY-MM-DD HH24:MI:SS') ";
		if(StringUtils.isNotBlank(electronicDocEndDate))
			hql += " and ar.electronic_doc_date<=to_date('" + electronicDocEndDate + "','YYYY-MM-DD HH24:MI:SS') ";
		Query query = getSession().createSQLQuery(hql).addEntity("ar",Archives.class)
				.setParameter("isStandard", isStandard)
				.setParameter("runStatus", runStatus)
				.setParameter("keywords", keywords)
				.setParameter("isComSetting", isComSetting);
		List<Archives> list = query.list();
		return query.list();
	}
	
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findAllSchemaArchives(String schemaCode,short archiveType,short status,String startDate,String endDate){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode + ".";
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = "SELECT ar.* FROM " + schemaCode + "Archives ar join " + schemaCode + 
				"process_run pr on ar.PROCESS_INS_ID = pr.runId where ar.status = :status and ar.archType = :archType";
		hql += " and ar.PROCESS_INS_ID is not null";
		if(StringUtils.isNotBlank(startDate))
			hql += " and ar.electronic_doc_date<to_date('" + startDate + "','YYYY-MM-DD HH24:MI:SS') ";
		/*if(StringUtils.isNotBlank(endDate))
			hql += " and ar.createtime<=to_date('" + endDate + "','YYYY-MM-DD HH24:MI:SS') ";*/
		Query query = getSession().createSQLQuery(hql).addEntity("ar",Archives.class)
				.setParameter("status", status)
				.setParameter("archType", archiveType);
		List<Archives> list = query.list();
		return query.list();
	}
	
	
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findOverdueArchives(String schemaCode,short archiveType,short status,String startDate,String endDate){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode + ".";
		ArrayList<Object> paramList = new ArrayList<Object>();
		String hql = "SELECT ar.* FROM " + schemaCode + "Archives ar join " + schemaCode + 
				"process_run pr on ar.PROCESS_INS_ID = pr.runId where ar.status = :status";
		hql += " and ar.PROCESS_INS_ID is not null";
		if(StringUtils.isNotBlank(startDate))
			hql += " and ar.electronic_doc_date<to_date('" + startDate + "','YYYY-MM-DD HH24:MI:SS') ";
		if(StringUtils.isNotBlank(endDate))
			hql += " and ar.createtime<=to_date('" + endDate + "','YYYY-MM-DD HH24:MI:SS') ";
		Query query = getSession().createSQLQuery(hql).addEntity("ar",Archives.class)
				.setParameter("status", status);
		List<Archives> list = query.list();
		return query.list();
	}

	@Override
	public List<Archives> getCC(HttpServletRequest request,Long userId, String defId, String archivesNo,
			String depName,String subject) {
		ArrayList<Object> paramList = new ArrayList<Object>();
		paramList.add(userId);
		String hql = "select vo from Archives vo join vo.archivesCCs as archivesCCs where vo.processRun.runStatus=2  and archivesCCs.userId=? ";
	
		if((defId!=null)&&(!defId.equals(""))){
			Long defID=new Long(defId);
			hql+=" and vo.processRun.proDefinition.defId=? ";
			paramList.add(defID);
		}
		if((archivesNo!=null)&&(!archivesNo.equals(""))){
			hql+=" and vo.archivesNo like '%'+?+'%' ";
			paramList.add(archivesNo);
		}
		
		if((depName!=null)&&(!depName.equals(""))){
			hql+=" and vo.issueDep like '%'+?+'%' ";
			paramList.add(depName);
		}
		
		if((subject!=null)&&(!subject.equals(""))){
			hql+=" and vo.subject like '%'+?+'%' ";
			paramList.add(subject);
		}
		
		//开始日期
				String strStartDateParam = "";
				if (request.getParameter("Q_createtime_D_GT") != null
						&& (!("").equals(request.getParameter("Q_createtime_D_GT")))) {
					strStartDateParam = request
								.getParameter("Q_createtime_D_GT") + " 00:00:00";

				} else {
					strStartDateParam = request
								.getParameter("queryStartDate")+ " 00:00:00";
				}
				
				//SQL SERVER
				//hql+= " and vo.createtime >='" + strStartDateParam + "' ";
				//ORACLE 
				hql+= " and vo.createtime >=to_date('" + strStartDateParam + "','YYYY-MM-DD HH24:MI:SS') ";
						
				//截至日期
				String strEndDateParam = "";
				if (request.getParameter("Q_createtime_D_LT") != null
						&& (!("").equals(request.getParameter("Q_createtime_D_LT")))) {			
					strEndDateParam = request
								.getParameter("Q_createtime_D_LT") + " 23:59:59";

				} else {
					strEndDateParam = request
								.getParameter("queryEndDate") + " 23:59:59";
				}
				//SQL SERVER
				//hql+= " and  vo.createtime <='"+strEndDateParam +"' order by vo.createtime desc";
				
				//ORACLE
				hql+= " and  vo.createtime <=to_date('"+strEndDateParam +"','YYYY-MM-DD HH24:MI:SS') order by vo.createtime desc";
				
		return findByHql(hql, paramList.toArray());
	}

	@Override
	public Archives getArchivesByRunId(Long runId) {
		// TODO Auto-generated method stub
		String hql = "from Archives vo where vo.processRun.runId = ?";
		Object[] objs = { runId};
		return (Archives)findUnique(hql, objs);
	}
	
	@Override
	public List<Archives> getArchivesByParentId(Long parentId) {
		final String hql = "from Archives a where a.parentArchId=?";
		Object[] params ={parentId};
		return findByHql(hql, params);

	}

	@Override
	public Long getArchId(Long runId) {
		final String sql = "select * from process_business_map where defid = (select defid from process_run where runId ="+runId+")";
		log.debug("---------------------------"+sql);
		List list = jdbcTemplate.queryForList(sql);
		Iterator it = list.iterator();
		if (it.hasNext()){
			Map map = (Map)it.next();
			String tableName = (String)map.get("business_table_name");
			String idName = (String)map.get("business_id_name");
			String fieldName = (String)map.get("process_ins_id_name");
			
			String archSql = "select "+idName+" from "+tableName+" where "+fieldName+" = "+runId;
			log.debug("---------------------------"+archSql);
			Long archId = -1L; 
			try{
				archId = jdbcTemplate.queryForLong(archSql);
				return archId;
			}catch(DataAccessException e){
				log.error("sql error:", e);
				return archId;
			}
		}else{
			return -1L;
		}
	}
	
	public List<FlowTaskReport> getFinishedFlow(final int archiveType,
			final String subject, final Long userId, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel, final Long snConfigId,final String depSignNo,final String issuerName, final int startPage, final int pageSize, final String dir,
			final String sort) {
		@SuppressWarnings("unchecked")
		List<FlowTaskReport> list=(List<FlowTaskReport>)jdbcTemplate.execute(new CallableStatementCreator() {
			
			@Override
			public CallableStatement createCallableStatement(Connection con)
					throws SQLException {
				String schemaName= "";
				if(null != ContextUtil.getCurrentUser()){
		    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
		    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
				}
				String storedProc="{call " + schemaName + " archives_manage_pg.get_archives_library(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
				CallableStatement cs=con.prepareCall(storedProc);
				cs.setInt(1, archiveType);
				cs.setString(2, subject);
				if(null==userId){
					cs.setNull(3, java.sql.Types.BIGINT);
				}
				else {
					cs.setLong(3, userId);
				}
				if(null==defId){
					cs.setNull(4, java.sql.Types.BIGINT);
				}
				else {
					cs.setLong(4, defId);
				}
				
				cs.setString(5, issuedep);
				cs.setString(6, orgdepId);
				cs.setString(7, startDate);
				cs.setString(8, endDate);
				cs.setString(9, archiveNo);
				cs.setString(10, privacyLevel);
				cs.setString(11, urgentLevel);
				if(null == snConfigId)
					cs.setNull(12, java.sql.Types.BIGINT);
				else
					cs.setLong(12, snConfigId);
				cs.setString(13, depSignNo);
				cs.setString(14, issuerName);
				cs.setInt(15, startPage);
				cs.setInt(16, pageSize);
				cs.registerOutParameter(17, java.sql.Types.INTEGER);
				cs.registerOutParameter(18, oracle.jdbc.OracleTypes.CURSOR);
				cs.setString(19, dir);
				cs.setString(20, sort);
				System.out.println(schemaName);
				System.out.println("****archiveType***"+archiveType+"******");
				System.out.println("****subject***"+subject+"******");
				System.out.println("****userId***"+userId+"******");
				System.out.println("****defId***"+defId+"******");
				System.out.println("****issuedep***"+issuedep+"******");
				System.out.println("****orgdepId***"+orgdepId+"******");
				System.out.println("****startDate***"+startDate+"******");
				System.out.println("****endDate***"+endDate+"******");
				System.out.println("****archiveNo***"+archiveNo+"******");
				System.out.println("****privacyLevel***"+privacyLevel+"******");
				System.out.println("****urgentLevel***"+urgentLevel+"******");
				System.out.println("****snConfigId***"+snConfigId+"******");
				System.out.println("****depSignNo***"+depSignNo+"******");
				System.out.println("****issuerName***"+issuerName+"******");
				System.out.println("****startPage***"+startPage+"******");
				System.out.println("****pageSize***"+pageSize+"******");
				System.out.println("****dir***"+dir+"******");
				System.out.println("****sort***"+sort+"******");
				return cs;
			}
		}, new CallableStatementCallback() {
			
			@Override
			public Object doInCallableStatement(CallableStatement cs)
					throws SQLException, DataAccessException {
				List<FlowTaskReport> ftrList=new ArrayList<FlowTaskReport>();
				cs.execute();
				int totalCounts=Integer.parseInt(cs.getObject(17).toString());
				ResultSet rs=(ResultSet)cs.getObject(18);
				int i=0;
				while(rs.next()){
					FlowTaskReport flowTaskReport=new FlowTaskReport();
					if (i==0) {
						flowTaskReport.setTotalCounts(totalCounts);
					}
					flowTaskReport.setDefId(rs.getLong("defid"));
					flowTaskReport.setRunId(rs.getLong("runid"));
					flowTaskReport.setRunSubject(rs.getString("subject"));
					flowTaskReport.setArchiveId(rs.getLong("archivesid"));
					flowTaskReport.setIssuerId(rs.getLong("issuerid"));
					flowTaskReport.setIssuer(rs.getString("issuer"));
					flowTaskReport.setArchCreateTime(rs.getDate("createtime"));
					flowTaskReport.setArchivesNo(rs.getString("archivesno"));
					flowTaskReport.setOrgdepName(rs.getString("orgdep_name"));
					flowTaskReport.setIssuedep(rs.getString("issuedep"));
					flowTaskReport.setFlowName(rs.getString("NAME"));
				    flowTaskReport.setSignDate(rs.getDate("sign_date"));
				    flowTaskReport.setWrittenDate(rs.getDate("written_date"));
				    flowTaskReport.setIssueDate(rs.getDate("issuedate"));
				    flowTaskReport.setDepSignNo(rs.getString("depsignno"));
				    ftrList.add(flowTaskReport);
				    i++;
				}
				rs.close();
				return ftrList;
			}
		});
		return list;
	}
	/**
	 * 规范性文件
	 */
	public List<FlowTaskReport> getIsStandardFinishedFlow(final int archiveType,
			final String subject, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel, final Long snConfigId, final int startPage, final int pageSize) {
		@SuppressWarnings("unchecked")
		List<FlowTaskReport> list=(List<FlowTaskReport>)jdbcTemplate.execute(new CallableStatementCreator() {
			
			@Override
			public CallableStatement createCallableStatement(Connection con)
					throws SQLException {
				String schemaName= "";
				if(null != ContextUtil.getCurrentUser()){
		    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
		    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
				}
				String storedProc="{call "+schemaName+"archives_manage_pg.get_archives_isstandard(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
				CallableStatement cs=con.prepareCall(storedProc);
				cs.setInt(1, archiveType);
				cs.setString(2, subject);
				if(null==defId){
					cs.setNull(3, java.sql.Types.BIGINT);
				}
				else {
					cs.setLong(3, defId);
				}
				
				cs.setString(4, issuedep);
				cs.setString(5, orgdepId);
				cs.setString(6, startDate);
				cs.setString(7, endDate);
				cs.setString(8, archiveNo);
				cs.setString(9, privacyLevel);
				cs.setString(10, urgentLevel);
				if(null == snConfigId)
					cs.setNull(11, java.sql.Types.BIGINT);
				else
					cs.setLong(11, snConfigId);
				cs.setInt(12, startPage);
				cs.setInt(13, pageSize);
				cs.registerOutParameter(14, java.sql.Types.INTEGER);
				cs.registerOutParameter(15, oracle.jdbc.OracleTypes.CURSOR);
				return cs;
			}
		}, new CallableStatementCallback() {
			
			@Override
			public Object doInCallableStatement(CallableStatement cs)
					throws SQLException, DataAccessException {
				List<FlowTaskReport> ftrList=new ArrayList<FlowTaskReport>();
				cs.execute();
				int totalCounts=Integer.parseInt(cs.getObject(14).toString());
				ResultSet rs=(ResultSet)cs.getObject(15);
				int i=0;
				while(rs.next()){
					FlowTaskReport flowTaskReport=new FlowTaskReport();
					if (i==0) {
						flowTaskReport.setTotalCounts(totalCounts);
					}
					flowTaskReport.setDefId(rs.getLong("defid"));
					flowTaskReport.setRunId(rs.getLong("runid"));
					flowTaskReport.setRunSubject(rs.getString("subject"));
					flowTaskReport.setArchiveId(rs.getLong("archivesid"));
					flowTaskReport.setIssuerId(rs.getLong("issuerid"));
					flowTaskReport.setIssuer(rs.getString("issuer"));
					flowTaskReport.setArchCreateTime(rs.getDate("createtime"));
					flowTaskReport.setArchivesNo(rs.getString("archivesno"));
					flowTaskReport.setOrgdepName(rs.getString("orgdep_name"));
					flowTaskReport.setIssuedep(rs.getString("issuedep"));
					flowTaskReport.setFlowName(rs.getString("NAME"));
				    flowTaskReport.setSignDate(rs.getDate("sign_date"));
				    flowTaskReport.setWrittenDate(rs.getDate("written_date"));
				    flowTaskReport.setIssueDate(rs.getDate("issuedate"));
				    flowTaskReport.setDepSignNo(rs.getString("depsignno"));
				    SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
				    if(null!=rs.getString("fullname")&&!"".equals(rs.getString("fullname"))){
				    	flowTaskReport.setStandardApprover(rs.getString("fullname"));
				    }else {
				    	flowTaskReport.setStandardApprover("");
					}
				    if (null!=rs.getDate("standard_approve_date")) {
						try {
							flowTaskReport.setStandardApproveDate(rs.getDate("standard_approve_date"));
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}else {
						flowTaskReport.setStandardApproveDate(null);
					}
				    ftrList.add(flowTaskReport);
				    i++;
				}
				rs.close();
				return ftrList;
			}
		});
		return list;
	}
	public List<Archives> findPublicArchives(String count){
		String hql="";
		if(count!=null&&!"".equals(count)&&StringUtils.isNotEmpty(count)){
			hql = "SELECT * FROM ( SELECT   a.*  FROM "+Constants.PUBLIC_SCHEMA_OA3+".archives a JOIN "+Constants.PUBLIC_SCHEMA_OA3+".process_run pr ON a.process_ins_id = pr.runid "
				   +"WHERE a.archtype = 0 AND a.is_public = 1 AND process_ins_id IS NOT NULL AND pr.runstatus = 2 ORDER BY archivesid DESC) where ROWNUM <="+count;
		}
		else{
			hql= "SELECT  a.*  FROM "+Constants.PUBLIC_SCHEMA_OA3 +".archives a JOIN "+Constants.PUBLIC_SCHEMA_OA3 +".process_run pr ON a.process_ins_id = pr.runid "
				   +"WHERE a.archtype = 0 AND a.is_public = 1 AND process_ins_id IS NOT NULL AND pr.runstatus = 2 ORDER BY archivesid DESC";
		}
		Query q = this.getSession().createSQLQuery(hql).addEntity(Archives.class);
		return q.list();
	}

	@Override
	public Archives getArchivesByRunIdAndSchema(String schema, Long runId) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql = "select a.* from " + schema + "archives a where a.process_ins_id = :runId";
		Query query = this.getSession().createSQLQuery(sql).addEntity("a", Archives.class).setParameter("runId", runId);
		List<Archives> list = query.list();
		if(list.size() > 0){
			return list.get(0);
		}else{
			return null;
		}
	}
	@Override
	public Long count(Long userId, String archivesNo,
			String depSignNo, String subject, int status) {
		String conditions = "";
		if (userId != null && !"".equals(userId))
			conditions += " and od.app_user_id=:userId";
		if (archivesNo != null && !"".equals(archivesNo))
			conditions += " and archives.archivesno like:archivesNo";
		if (depSignNo != null && !"".equals(depSignNo))
			conditions += " and archives.depsignno like:depSignNo";
		if (subject != null && !"".equals(subject))
			conditions += " and archives.subject like:subject";
		if (status != -1&&!"".equals(status))
			conditions += " and od.status=:status";
		String sql = "SELECT count(*) from (select distinct od.id from archives  archives inner join od_archives_cc  od on archives.archivesid=od.archives_id inner join process_run  pr on archives.process_ins_id=pr.runid inner join  jbpm4_task  jbpm on jbpm.execution_id_=pr.piid inner join app_user  ar on jbpm.assignee_=ar.userid where ar.userid<>:userId"+conditions+")";
		Query q = getSession().createSQLQuery(sql);
		if (userId != null && !"".equals(userId))
		q.setParameter("userId", userId);
		if (archivesNo != null && !"".equals(archivesNo))
			q.setParameter("archivesNo", "%" + archivesNo + "%" );
		if (depSignNo != null && !"".equals(depSignNo))
			q.setParameter("depSignNo","%" + depSignNo + "%" );
		if (subject != null && !"".equals(subject))
			q.setParameter("subject",  "%" + subject + "%");
		if (status != -1&&!"".equals(status))
			q.setParameter("status", status);
		List olist = q.list();
		BigDecimal count = null;
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}
	@Override
	public List<OdArchivescc> listCC(Long userId, String archivesNo,
			String depSignNo, String subject, int status, int start, int size) {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String conditions = "";
		if (userId != null && !"".equals(userId))
			conditions += " and od.app_user_id=:userId";
		if (archivesNo != null && !"".equals(archivesNo))
			conditions += " and archives.archivesno like:archivesNo";
		if (depSignNo != null && !"".equals(depSignNo))
			conditions += " and archives.depsignno like:depSignNo";
		if (subject != null && !"".equals(subject))
			conditions += " and archives.subject like:subject";
		if (status != -1&&!"".equals(status))
			conditions += " and od.status=:status";
		String sql = "SELECT  max(a.id) id,max(a.archivesid) archivesid,max(a.subject) subject,max(a.issuer) issuer,max(a.createtime) createtime,max(a.runid) runid,max(a.defid) defid,max(a.activity_name_) activityname,wm_concat(a.fullname) fullname,max(a.status) status,max(a.app_user_id) appuserid,max(a.archivesno) archivesno,max(a.depsignno) depsignno,max(a.userid) userid FROM (select od.id,archives.archivesid,archives.subject,archives.issuer,archives.createtime,pr.runid,pr.defid,jbpm.activity_name_,ar.fullname,od.status,od.app_user_id,archives.archivesno,archives.depsignno ,ar.userid from archives  archives inner join od_archives_cc  od on archives.archivesid=od.archives_id inner join process_run  pr on archives.process_ins_id=pr.runid inner join  jbpm4_task  jbpm on jbpm.execution_id_=pr.piid inner join app_user  ar on jbpm.assignee_=to_char(ar.userid) where ar.userid<>:userId"+conditions+")a  group by a.id";
		Query q = getSession().createSQLQuery(sql).setFirstResult(start)
				.setMaxResults(size);
		if (userId != null && !"".equals(userId))
		q.setParameter("userId", userId);
		if (archivesNo != null && !"".equals(archivesNo))
			q.setParameter("archivesNo", "%" + archivesNo + "%" );
		if (depSignNo != null && !"".equals(depSignNo))
			q.setParameter("depSignNo","%" + depSignNo + "%" );
		if (subject != null && !"".equals(subject))
			q.setParameter("subject",  "%" + subject + "%");
		if (status != -1&&!"".equals(status))
			q.setParameter("status", status);
		List olist = q.list();
		List<OdArchivescc> list = new ArrayList<OdArchivescc>();

		for (int i = 0; i < olist.size(); i++) {
			Object[] s = (Object[]) olist.get(i);
			OdArchivescc odArchivescc = new OdArchivescc();
			odArchivescc.setId(Long.valueOf(s[0].toString()));// id
			odArchivescc.setArchivesId(Long.valueOf(s[1].toString()));// archivesid
			if (null != s[2] && !"".equals(s[2]))
				odArchivescc.setSubject(s[2].toString());// subject标题
			else
				odArchivescc.setSubject(null);
			if (null != s[3] && !"".equals(s[3]))
				odArchivescc.setIssuer(s[3].toString());// issuer创建人
			else
				odArchivescc.setSubject(null);
			Date sdt = null;
			try {
				sdt = formatter.parse(s[4].toString());
			} catch (ParseException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			odArchivescc.setCreatetime(sdt);// 创建时间
			if (null != s[5] && !"".equals(s[5]))
				odArchivescc.setRunId(Long.valueOf(s[5].toString()));// runID
			else
				odArchivescc.setRunId(null);
			if (null != s[6] && !"".equals(s[6]))
				odArchivescc.setDefId(Long.valueOf(s[6].toString()));// defid
			if (null != s[7] && !"".equals(s[7]))
				odArchivescc.setTaskName(s[7].toString());// 流程步骤taskname
			if (null != s[8] && !"".equals(s[8]))
				odArchivescc.setAssignUserName(s[8].toString());// 流程办理人assignUserName
			if (null != s[9] && !"".equals(s[9]))
				odArchivescc.setStatus(Short.valueOf(s[9].toString()));
			list.add(odArchivescc);
		}
		return list;
	}
	public Archives getPublicArchiveDetail(String archivesId,String Schema){
		String sql ="SELECT pd.NAME, a.archivesno, a.urgentlevel, a.privacylevel, a.issuer,"
			       +"a.review_user_name, a.issuedep, AT.typename, a.sources, a.is_standard,"
			       +"a.is_public, a.filecounts, a.send_to, a.cc_to, a.subject, a.enclosure,"
			       +"(SELECT d.depname FROM " + Schema
			       +".app_user au JOIN "+Schema+".department d ON au.depid = d.depid "
			       +" WHERE userid = a.issuerid) AS depname FROM "+Schema+".archives a JOIN "
			       +Schema+".archives_type AT ON a.typeid = AT.typeid JOIN "
			       +Schema+".process_run pr ON a.process_ins_id = pr.runid JOIN " 
			       +Schema+".pro_definition pd ON pd.defid = pr.defid WHERE a.archivesid = "+archivesId;
		Query q = getSession().createSQLQuery(sql);
		List list=q.list();
		Archives archives=new Archives();
		if(list!=null&&list.size()>0){
			Object[] objs = (Object[])list.get(0);
			if(objs[0]!=null)  archives.setArchChecker(objs[0].toString());
			if(objs[1]!=null)  archives.setArchivesNo(objs[1].toString());
			if(objs[2]!=null)  archives.setUrgentLevel(objs[2].toString());
			if(objs[3]!=null)  archives.setPrivacyLevel(objs[3].toString());
			if(objs[4]!=null)  archives.setIssuer(objs[4].toString());
			if(objs[5]!=null)  archives.setReviewUserName(objs[5].toString());
			if(objs[6]!=null)  archives.setIssueDep(objs[6].toString());
			if(objs[7]!=null)  archives.setTypeName(objs[7].toString());
			if(objs[8]!=null)  archives.setSources(objs[8].toString());
			if(objs[9]!=null)  archives.setIsStandard(new Short(objs[9].toString()));
			if(objs[10]!=null) archives.setIsPublic(new Short(objs[10].toString()));
			if(objs[11]!=null) archives.setFileCounts(new Integer(objs[11].toString()));
			if(objs[12]!=null) archives.setSendTo(objs[12].toString());
			if(objs[13]!=null) archives.setCcTo(objs[13].toString());
			if(objs[14]!=null) archives.setSubject(objs[14].toString());
			if(objs[15]!=null) archives.setEnclosure(objs[15].toString());
			if(objs[16]!=null) archives.setArchPrinter(objs[16].toString());
		}
		return archives;
	}
	@Override
	public Long getrun(Long archivesId, String schemacode){
		String sql ="select  archives.PROCESS_INS_ID from  "+schemacode+".archives archives where ARCHIVES.ARCHIVESID="+archivesId;
		Query q = getSession().createSQLQuery(sql);
		List list=q.list();
		Archives archives=new Archives();
		BigDecimal b=new BigDecimal(0);
		if(list.size()>0&&null!=list.get(0)){
		// runid=Long.valueOf(list.get(0).toString());
		 b=(BigDecimal)list.get(0);
	}
		return b.longValue();
	}
	
	public List<FlowTaskReport> getIsStandardFinishedFlowJW(final int archiveType,
			final String subject, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel, final Long snConfigId, final Long isStandard, 
			final String keywords, final int startPage, final int pageSize) {
		@SuppressWarnings("unchecked")
		List<FlowTaskReport> list=(List<FlowTaskReport>)jdbcTemplate.execute(new CallableStatementCreator() {
			
			@Override
			public CallableStatement createCallableStatement(Connection con)
					throws SQLException {
				String schemaName= "";
				if(null != ContextUtil.getCurrentUser()){
		    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
		    			schemaName = ContextUtil.getCurrentUser().getOwnerSchema()+".";
				}
				String storedProc="{call "+schemaName+"archives_manage_isstandard_pg.get_archives_isstandard(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)}";
				CallableStatement cs=con.prepareCall(storedProc);
				cs.setInt(1, archiveType);
				cs.setString(2, subject);
				if(null==defId){
					cs.setNull(3, java.sql.Types.BIGINT);
				}
				else {
					cs.setLong(3, defId);
				}
				
				cs.setString(4, issuedep);
				cs.setString(5, orgdepId);
				cs.setString(6, startDate);
				cs.setString(7, endDate);
				cs.setString(8, archiveNo);
				cs.setString(9, privacyLevel);
				cs.setString(10, urgentLevel);
				if(null == snConfigId)
					cs.setNull(11, java.sql.Types.BIGINT);
				else
					cs.setLong(11, snConfigId);
				if(null == isStandard)
					cs.setNull(12, java.sql.Types.BIGINT);
				else
					cs.setLong(12, isStandard);
				cs.setString(13, keywords);
				cs.setInt(14, startPage);
				cs.setInt(15, pageSize);
				cs.registerOutParameter(16, java.sql.Types.INTEGER);
				cs.registerOutParameter(17, oracle.jdbc.OracleTypes.CURSOR);
				return cs;
			}
		}, new CallableStatementCallback() {
			
			@Override
			public Object doInCallableStatement(CallableStatement cs)
					throws SQLException, DataAccessException {
				List<FlowTaskReport> ftrList=new ArrayList<FlowTaskReport>();
				cs.execute();
				int totalCounts=Integer.parseInt(cs.getObject(16).toString());
				ResultSet rs=(ResultSet)cs.getObject(17);
				int i=0;
				while(rs.next()){
					FlowTaskReport flowTaskReport=new FlowTaskReport();
					if (i==0) {
						flowTaskReport.setTotalCounts(totalCounts);
					}
					flowTaskReport.setDefId(rs.getLong("defid"));
					flowTaskReport.setRunId(rs.getLong("runid"));
					flowTaskReport.setRunSubject(rs.getString("subject"));
					flowTaskReport.setArchiveId(rs.getLong("archivesid"));
					flowTaskReport.setIssuerId(rs.getLong("issuerid"));
					flowTaskReport.setIssuer(rs.getString("issuer"));
					flowTaskReport.setArchCreateTime(rs.getDate("createtime"));
					flowTaskReport.setArchivesNo(rs.getString("archivesno"));
					flowTaskReport.setOrgdepName(rs.getString("orgdep_name"));
					flowTaskReport.setIssuedep(rs.getString("issuedep"));
					flowTaskReport.setFlowName(rs.getString("NAME"));
				    flowTaskReport.setSignDate(rs.getDate("sign_date"));
				    flowTaskReport.setWrittenDate(rs.getDate("written_date"));
				    flowTaskReport.setIssueDate(rs.getDate("issuedate"));
				    flowTaskReport.setDepSignNo(rs.getString("depsignno"));
				    SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
				    if(null!=rs.getString("fullname")&&!"".equals(rs.getString("fullname"))){
				    	flowTaskReport.setStandardApprover(rs.getString("fullname"));
				    }else {
				    	flowTaskReport.setStandardApprover("");
					}
				    if (null!=rs.getDate("standard_approve_date")) {
						try {
							flowTaskReport.setStandardApproveDate(rs.getDate("standard_approve_date"));
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}else {
						flowTaskReport.setStandardApproveDate(null);
					}
				    ftrList.add(flowTaskReport);
				    i++;
				}
				rs.close();
				return ftrList;
			}
		});
		return list;
	}
}

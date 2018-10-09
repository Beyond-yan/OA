package com.gdssoft.oa.dao.system.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.xml.crypto.Data;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import java.math.BigDecimal;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.system.SysDataTransferDao;
import com.gdssoft.oa.model.admin.CarDriver;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysDataTransfer;

@SuppressWarnings("unchecked")
public class SysDataTransferDaoImpl extends BaseDaoImpl<SysDataTransfer>
		implements SysDataTransferDao {

	public SysDataTransferDaoImpl() {
		super(SysDataTransfer.class);
	}
	public List<SysDataTransfer> getListByArchivesId(Long archivesId){
		String connection = "";
//		String hql = "from SysDataTransfer sdt left join SysDepartmentConfig as sdc sdt.receiveDep=sdc.depCode where sdt.archivesId=:archivesId";
		String hql = "select distinct sdt.id AS tempID ,{sdt.*} from "+Constants.PUBLIC_SCHEMA_CODE+".sys_data_transfer sdt left join "
				+Constants.PUBLIC_SCHEMA_CODE+".sys_department_config sdc on sdt.receive_dep=sdc.dep_code where SDT.ID IN (SELECT MAX(ID) FROM SYS_DATA_TRANSFER WHERE source_type=1 and archives_id=:archivesId GROUP BY RECEIVE_DEP UNION ALL SELECT ID FROM SYS_DATA_TRANSFER WHERE source_type=2 and archives_id=:archivesId  ) " + connection;
		Query query = this.getSession().createSQLQuery(hql).addEntity("sdt", SysDataTransfer.class);
		query.setParameter("archivesId", archivesId);
		return query.list();
	}
	public int getListMonitorCount(Long archivesId, String depName, String receiveDate, Long receiveFlag, String receiveUserName){
		String connection = "";
		if(StringUtils.isNotBlank(depName)){
			connection += " and sdc.DEP_NAME like '%" + depName + "%'";
		}
		if(StringUtils.isNotBlank(receiveDate)){
			connection += " and to_char(sdt.RECEIVE_DATE, 'YYYY-MM-DD') = :receiveDate";
		}
		if(null != receiveFlag){
			connection += " and sdt.RECEIVE_FLAG=:receiveFlag";
		}
		if(StringUtils.isNotBlank(receiveUserName)){
			connection += " and sdt.RECEIVE_USER_NAME like '%" + receiveUserName + "%'";
		}
		String hql = "select distinct sdt.id AS tempID , {sdt.*} from "+Constants.PUBLIC_SCHEMA_CODE+".sys_data_transfer sdt left join "
				+Constants.PUBLIC_SCHEMA_CODE+".sys_department_config sdc on sdt.receive_dep=sdc.dep_code where  SDT.ID IN (SELECT MAX(ID) FROM SYS_DATA_TRANSFER WHERE source_type=1 and archives_id=:archivesId GROUP BY RECEIVE_DEP UNION ALL SELECT ID FROM SYS_DATA_TRANSFER WHERE source_type=2 and archives_id=:archivesId  ) " + connection;
		Query query = this.getSession().createSQLQuery(hql).addEntity("sdt", SysDataTransfer.class);
		query.setParameter("archivesId", archivesId);
		if(StringUtils.isNotBlank(receiveDate)){
			query.setParameter("receiveDate", receiveDate);
		}
		if(null != receiveFlag){
			query.setParameter("receiveFlag", receiveFlag);
		}
		if(null == query.list()){
			return 0;
		}else{
			return query.list().size();
		}
	}

	public List<SysDataTransfer> getListMonitor(int start, int limit, Long archivesId, String depName, String receiveDate, Long receiveFlag, String receiveUserName) {
		String connection = "";
		if(StringUtils.isNotBlank(depName)){
			connection += " and sdc.DEP_NAME like '%" + depName + "%'";
		}
		if(StringUtils.isNotBlank(receiveDate)){
			connection += " and to_char(sdt.RECEIVE_DATE, 'YYYY-MM-DD') = :receiveDate";
		}
		if(null != receiveFlag){
			connection += " and sdt.RECEIVE_FLAG=:receiveFlag";
		}
		if(StringUtils.isNotBlank(receiveUserName)){
			connection += " and sdt.RECEIVE_USER_NAME like '%" + receiveUserName + "%'";
		}
//		String hql = "from SysDataTransfer sdt left join SysDepartmentConfig as sdc sdt.receiveDep=sdc.depCode where sdt.archivesId=:archivesId";
		String hql = "select distinct sdt.id AS tempID ,{sdt.*} from "+Constants.PUBLIC_SCHEMA_CODE+".sys_data_transfer sdt left join "
				+Constants.PUBLIC_SCHEMA_CODE+".sys_department_config sdc on sdt.receive_dep=sdc.dep_code where SDT.ID IN (SELECT MAX(ID) FROM SYS_DATA_TRANSFER WHERE source_type=1 and archives_id=:archivesId GROUP BY RECEIVE_DEP UNION ALL SELECT ID FROM SYS_DATA_TRANSFER WHERE source_type=2 and archives_id=:archivesId  ) " + connection;
		Query query = this.getSession().createSQLQuery(hql).addEntity("sdt", SysDataTransfer.class).setFirstResult(start).setMaxResults(limit);
		query.setParameter("archivesId", archivesId);
		if(StringUtils.isNotBlank(receiveDate)){
			query.setParameter("receiveDate", receiveDate);
		}
		if(null != receiveFlag){
			query.setParameter("receiveFlag", receiveFlag);
		}
		return query.list();
	}

	@Override
	public Long count(Long depId,String fromShcemaid, String toShcemaid,
			String receiveDep, String receivetype ,String subject,String sendDep ,String receiveFlag,String issuer,String sourceType) {
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		String conditions = "";
		if (fromShcemaid != null && !"".equals(fromShcemaid))
			conditions += " and a.FROM_SCHEMA=:fromShcemaid";
		if (toShcemaid != null && !"".equals(toShcemaid))
			conditions += " and a.to_schema_id=:toShcemaid";
		if (subject != null && !"".equals(subject))
			conditions += " and a.subject like:subject";
		if (sendDep != null && !"".equals(sendDep))
			conditions += " and a.send_dep like:sendDep";
		if (receiveFlag != null && !"".equals(receiveFlag))
			conditions += " and a.receive_flag=:receiveFlag";
		if (issuer != null && !"".equals(issuer))
			conditions += " and a.issuer like:issuer";
		if (receivetype != null && !"".equals(receivetype))
			conditions += " and a.receive_type>=1 and a.receive_type<=2";
		if (sourceType != null && !"".equals(sourceType))
			conditions += " and a.SOURCE_TYPE=:sourceType";
		String sql = "SELECT * FROM sys_data_transfer a JOIN (SELECT     depunitcode FROM "
				+ schemaCode
				+ ".department START WITH depid = :depId CONNECT BY PRIOR parentid = depid) b ON a.receive_dep = b.depunitcode  WHERE 1 = 1 "
				+ conditions;

		/*
		 * "SELECT COUNT(*) FROM (SELECT * FROM sys_data_transfer a JOIN (SELECT  depunitcode FROM "
		 * + schemaCode +
		 * ".department  START WITH depid = :depId CONNECT BY PRIOR parentid = depid) b ON a.receive_dep = b.depunitcode where 1=1"
		 * + conditions+")";
		 */

		Query q = getSession().createSQLQuery(sql)
				.addEntity("a", SysDataTransfer.class)
				.setParameter("depId", depId);
		if (fromShcemaid != null && !"".equals(fromShcemaid))
			q.setParameter("fromShcemaid", fromShcemaid);
		if (toShcemaid != null && !"".equals(toShcemaid))
			q.setParameter("toShcemaid", toShcemaid);
		if (subject != null && !"".equals(subject))
			q.setParameter("subject", "%" + subject + "%");
		if (sendDep != null && !"".equals(sendDep))
			q.setParameter("sendDep", "%" + sendDep + "%");
		if (receiveFlag != null && !"".equals(receiveFlag))
			q.setParameter("receiveFlag", receiveFlag);
		if (issuer != null && !"".equals(issuer))
			q.setParameter("issuer", "%" + issuer + "%");
		if (sourceType != null && !"".equals(sourceType))
			q.setParameter("sourceType", sourceType);
		List list = q.list();
		Long count = 0L;
		if (list != null) {
			count = new Long(list.size());
		}
		return count;
	}

	@Override
	public List<SysDataTransfer> getdepcode(Long depId,String fromShcemaid,
			String toShcemaid, String receiveDep, String receivetype,String subject,String sendDep ,String receiveFlag,String issuer,
			int size, int start,String sourceType) {
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		String userName=ContextUtil.getCurrentUser().getUsername();
		String conditions = "";
		if (fromShcemaid != null && !"".equals(fromShcemaid))
			conditions += " and a.FROM_SCHEMA=:fromShcemaid";
		if (toShcemaid != null && !"".equals(toShcemaid))
			conditions += " and a.to_schema_id=:toShcemaid";
		if (subject != null && !"".equals(subject))
			conditions += " and a.subject like:subject";
		if (sendDep != null && !"".equals(sendDep))
			conditions += " and a.send_dep like:sendDep";
		if (receiveFlag != null && !"".equals(receiveFlag))
			conditions += " and a.receive_flag=:receiveFlag";
		if (issuer != null && !"".equals(issuer))
			conditions += " and a.issuer like:issuer";
		if (receivetype != null && !"".equals(receivetype))
			conditions += " and a.receive_type>=1 and a.receive_type<=2";
		if (sourceType != null && !"".equals(sourceType))
			conditions += " and a.SOURCE_TYPE=:sourceType";
		String sql = "SELECT * FROM ( SELECT a.* FROM sys_data_transfer a JOIN (SELECT  depunitcode FROM "
				+ schemaCode
				+ ".department  START WITH depid = :depId CONNECT BY PRIOR parentid = depid) b ON a.receive_dep = b.depunitcode where 1=1 and a.source_type = 1"
				+ conditions+" UNION SELECT * FROM sys_data_transfer a WHERE a.source_type = 2 AND a.source_user = :userName"+conditions
				+" ) order by CREATE_DATE desc";
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a", SysDataTransfer.class)
				.setParameter("depId", depId).setParameter("userName", userName).setFirstResult(start)
				.setMaxResults(size);
		if (fromShcemaid != null && !"".equals(fromShcemaid))
			q.setParameter("fromShcemaid", fromShcemaid);
		if (toShcemaid != null && !"".equals(toShcemaid))
			q.setParameter("toShcemaid", toShcemaid);
		if (subject != null && !"".equals(subject))
			q.setParameter("subject", "%" + subject + "%");
		if (sendDep != null && !"".equals(sendDep))
			q.setParameter("sendDep", "%" + sendDep + "%");
		if (receiveFlag != null && !"".equals(receiveFlag))
			q.setParameter("receiveFlag", receiveFlag);
		if (issuer != null && !"".equals(issuer))
			q.setParameter("issuer", "%" + issuer + "%");
		if (sourceType != null && !"".equals(sourceType))
			q.setParameter("sourceType", sourceType);
	/*	if (receiveDep != null && !"".equals(receiveDep))
			q.setParameter("receiveDep", receiveDep);*/
		List list = q.list();
		return list;
	}
	/**
	 * 获得待签收公文的接口
	 */
	public List<SysDataTransfer> getUnReceiveArchives(String schema,Long schemaId,Long depId,String count,Boolean isAdmin,Boolean isArchReceiver){
		String sql="";
		if(isAdmin){
			sql = "SELECT * FROM (SELECT send_dep, subject, create_date, receive_type FROM sys_data_transfer WHERE receive_flag = 0 ORDER BY create_date DESC) WHERE ROWNUM <="+ count;
		}else{
			if(!isArchReceiver){
				sql="SELECT * FROM (SELECT   b.send_dep, b.subject, b.create_date, b.receive_type "
						+ " FROM (SELECT a.send_dep, a.subject, a.create_date, a.receive_type FROM sys_data_transfer a JOIN ( SELECT depunitcode FROM "
						+ schema+".department START WITH depid = "
						+ depId+ "CONNECT BY PRIOR parentid = depid) b ON a.receive_dep = b.depunitcode WHERE 1 = 1 "
						+"AND a.receive_type >= 1 AND a.receive_type <= 2 AND receive_flag = 0) b ORDER BY b.create_date DESC) WHERE ROWNUM <= "+count;
			}else{
				sql = "SELECT * FROM (SELECT   b.send_dep, b.subject, b.create_date, b.receive_type "
					    +" FROM (SELECT send_dep, subject, create_date, receive_type FROM sys_data_transfer WHERE to_schema_id = "
					    + schemaId+" AND receive_type = 0 AND receive_flag = 0 UNION SELECT a.send_dep, a.subject, a.create_date, a.receive_type "
					    +" FROM sys_data_transfer a JOIN (SELECT  depunitcode FROM "
					    + schema+".department START WITH depid = "
					    + depId+" CONNECT BY PRIOR parentid = depid) b ON a.receive_dep = b.depunitcode WHERE 1 = 1 AND a.receive_type >= 1"
					    +" AND a.receive_type <= 2 AND receive_flag = 0) b ORDER BY b.create_date DESC) WHERE ROWNUM <= "+count;
			}
		}
		Query q = getSession().createSQLQuery(sql);
		List list = q.list();
		List<SysDataTransfer> sysDataTransferList=new ArrayList<SysDataTransfer>();
		for(int i=0;i<list.size();i++){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			Object[] objs = (Object[])list.get(i);
			SysDataTransfer sysDataTransfer = new SysDataTransfer();
			sysDataTransfer.setSendDep(objs[0].toString());
			sysDataTransfer.setSubject(objs[1].toString());
			if(objs[2]!=null){
			sysDataTransfer.setCreateDate((Date) objs[2]);
			}
			sysDataTransfer.setReceiveType(new Integer(objs[3].toString()));
			sysDataTransferList.add(sysDataTransfer);
		}
		return sysDataTransferList;
	}
	/*收文下载监控列表去重后的list*/
	@Override
	public List<SysDataTransfer> getReceiveDownload(int start, int limit, String subject,String archivesno,  Date endtime, Date creattime, String UserName,String archtype) {
		ArrayList<SysDataTransfer> SysDataTransferlist= new ArrayList<SysDataTransfer>();
		String conditions = "";
		String schamal=Constants.PUBLIC_SCHEMA_CODE;
		if (subject != null && !"".equals(subject))
			conditions += " and SUBJECT like :subject ";
		if (null != archivesno && !"".equals(archivesno))
			conditions += " and ARCHIVESNO like :archivesno ";
		if (endtime != null && !"".equals(endtime))
			conditions += " and CREATE_DATE >= :endtime ";
		if (creattime != null && !"".equals(creattime))
			conditions += " and CREATE_DATE <= :creattime ";
		if (null != UserName && !"".equals(UserName))
			conditions += " and CREATE_USER = :UserName ";
		//String sql = "select C.ARCHIVES_ID,C.ARCHIVESNO,C.SEND_DEP,C.SUBJECT,C.ARCHTYPE,C.ISSUERID,C.ISSUER,C.PRIVACYLEVEL,C.URGENTLEVEL,C.SOURCES,C.WRITTEN_DATE,C.FROM_SCHEMA,C.RECEIVE_FLAG,C.CREATE_DATE,C.DATA_SOURCE,C.ID,C.CREATE_USER from "+schamal+".SYS_DATA_TRANSFER c inner join (select max(A.id) as id, A.ARCHIVES_ID from "+schamal+".SYS_DATA_TRANSFER A group by  A.ARCHIVES_ID)m  on c.id=m.id where c.ARCHTYPE="+archtype+" "+conditions+"order by C.CREATE_DATE desc";
		//String sql = "SELECT  C.ARCHIVES_ID,C.ARCHIVESNO,C.SEND_DEP,C.SUBJECT,C.ARCHTYPE,C.ISSUERID,C.ISSUER,C.PRIVACYLEVEL,C.URGENTLEVEL,C.SOURCES,C.WRITTEN_DATE,C.FROM_SCHEMA,C.RECEIVE_FLAG,C.CREATE_DATE,C.DATA_SOURCE,C.ID,C.CREATE_USER  from OA_COMMON.SYS_DATA_TRANSFER c  WHERE c.ARCHTYPE="+archtype+" "+conditions+"order by C.CREATE_DATE desc";
		String sql="SELECT C.ID, C.ARCHIVES_ID,C.ARCHIVESNO,C.CREATE_DATE,C.SUBJECT,C.ARCHTYPE,C.DATA_SOURCE,C.FROM_SCHEMA,C.CREATE_USER,C.RECEIVE_FLAG"
		+" FROM "
		+" ("
		+" SELECT MIN(ID) AS ID,ARCHIVES_ID,ARCHIVESNO,CREATE_DATE,SUBJECT,ARCHTYPE,DATA_SOURCE,FROM_SCHEMA,CREATE_USER,SUM(RECEIVE_FLAG) RECEIVE_FLAG"
		+" from OA_COMMON.SYS_DATA_TRANSFER  "
		+" WHERE ARCHTYPE= "+archtype+" "+conditions
		+" GROUP BY ARCHIVES_ID,ARCHIVESNO,CREATE_DATE,SUBJECT,ARCHTYPE,DATA_SOURCE,FROM_SCHEMA,CREATE_USER"
		+" order by CREATE_DATE desc"
		+" ) C";
		Query q =getSession().createSQLQuery(sql)
				.setFirstResult(start).setMaxResults(limit);
		if (subject != null && !"".equals(subject))
			q.setParameter("subject", "%" + subject + "%");
		if (archivesno != null && !"".equals(archivesno))
			q.setParameter("archivesno", "%" + archivesno + "%"	);
		if (endtime != null && !"".equals(endtime))
			q.setParameter("endtime", endtime);
		if (creattime != null && !"".equals(creattime))
			q.setParameter("creattime", creattime );
		if (UserName != null && !"".equals(UserName))
			q.setParameter("UserName", UserName );
		List list = q.list();
		for(int i =0; i<list.size(); i++){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Object[] objects = (Object[])list.get(i);
			SysDataTransfer sysDataTransfer = new SysDataTransfer();
			if( null!=objects[0]) sysDataTransfer.setId( new Long(objects[0].toString()));
			if( null!=objects[1])sysDataTransfer.setArchivesId(new Long(objects[1].toString()));
			if( null!=objects[2]) sysDataTransfer.setArchivesno(objects[2].toString());
			if( null!=objects[3]) {
			try {
				sysDataTransfer.setCreateDate(sdf.parse( objects[3].toString()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}}
			if( null!=objects[4]) sysDataTransfer.setSubject( objects[4].toString());
			if( null!=objects[5]) sysDataTransfer.setArchtype( new Long(objects[5].toString()));
			if( null!=objects[6]) sysDataTransfer.setDataSource( new Long(objects[6].toString()));
			if( null!=objects[7]) sysDataTransfer.setFromSchema( new Long(objects[7].toString()));
			if( null!=objects[8]) sysDataTransfer.setCreateUser( objects[8].toString());
			if( null!=objects[9]) sysDataTransfer.setReceiveFlag( new Long(objects[9].toString()));
//			if( null!=objects[1]) sysDataTransfer.setArchivesno(objects[1].toString());
//			if( null!=objects[2]) sysDataTransfer.setSendDep(objects[2].toString());
//			if( null!=objects[3]) sysDataTransfer.setSubject( objects[3].toString());
//			if( null!=objects[4]) sysDataTransfer.setArchtype( new Long(objects[4].toString()));
//			if( null!=objects[5]) sysDataTransfer.setIssuerid( new Long(objects[5].toString()));
//			if( null!=objects[6]) sysDataTransfer.setIssuer( objects[6].toString());
//			if( null!=objects[7]) sysDataTransfer.setPrivacylevel(objects[7].toString());
//			if( null!=objects[8]) sysDataTransfer.setUrgentlevel( objects[8].toString());
//			if( null!=objects[9]) sysDataTransfer.setSources( objects[9].toString());
//			if( null!=objects[10]) {
//			try {
//				sysDataTransfer.setWrittenDate(sdf.parse(objects[10].toString()));
//			} catch (ParseException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}}
//			if( null!=objects[11]) sysDataTransfer.setFromSchema( new Long(objects[11].toString()));
//			if( null!=objects[12]) sysDataTransfer.setReceiveFlag( new Long(objects[12].toString()));
//			if( null!=objects[13]) {
//			try {
//				sysDataTransfer.setCreateDate(sdf.parse( objects[13].toString()));
//			} catch (ParseException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}}
//			if( null!=objects[14]) sysDataTransfer.setDataSource( new Long(objects[14].toString()));
//			if( null!=objects[15]) sysDataTransfer.setId( new Long(objects[15].toString()));
//			if( null!=objects[16]) sysDataTransfer.setCreateUser( objects[16].toString());
			SysDataTransferlist.add(sysDataTransfer);
		}
		return SysDataTransferlist;
	}
	@Override
	public Long count( String subject,String archivesno, Date endtime, Date creattime, String UserName,String archtype){
		String conditions = "";
		if (subject != null && !"".equals(subject))
			conditions += " and SUBJECT like :subject ";
		if (null != archivesno && !"".equals(archivesno))
			conditions += " and ARCHIVESNO like :archivesno ";
		if (endtime != null && !"".equals(endtime))
			conditions += " and CREATE_DATE >= :endtime ";
		if (creattime != null && !"".equals(creattime))
			conditions += " and CREATE_DATE <= :creattime ";
		if (null != UserName && !"".equals(UserName))
			conditions += " and CREATE_USER = :UserName ";
		//String sql = "select C.ARCHIVES_ID,C.ARCHIVESNO,C.SEND_DEP,C.SUBJECT,C.ARCHTYPE,C.ISSUERID,C.ISSUER,C.PRIVACYLEVEL,C.URGENTLEVEL,C.SOURCES,C.WRITTEN_DATE,C.FROM_SCHEMA,C.RECEIVE_FLAG,C.CREATE_DATE,C.DATA_SOURCE,C.ID,C.CREATE_USER from "+schamal+".SYS_DATA_TRANSFER c inner join (select max(A.id) as id, A.ARCHIVES_ID from "+schamal+".SYS_DATA_TRANSFER A group by  A.ARCHIVES_ID)m  on c.id=m.id where c.ARCHTYPE="+archtype+" "+conditions+"order by C.CREATE_DATE desc";
		//String sql = "SELECT  C.ARCHIVES_ID,C.ARCHIVESNO,C.SEND_DEP,C.SUBJECT,C.ARCHTYPE,C.ISSUERID,C.ISSUER,C.PRIVACYLEVEL,C.URGENTLEVEL,C.SOURCES,C.WRITTEN_DATE,C.FROM_SCHEMA,C.RECEIVE_FLAG,C.CREATE_DATE,C.DATA_SOURCE,C.ID,C.CREATE_USER  from OA_COMMON.SYS_DATA_TRANSFER c  WHERE c.ARCHTYPE="+archtype+" "+conditions+"order by C.CREATE_DATE desc";
		String sql="SELECT C.ID, C.ARCHIVES_ID,C.ARCHIVESNO,C.CREATE_DATE,C.SUBJECT,C.ARCHTYPE,C.DATA_SOURCE,c.FROM_SCHEMA,C.CREATE_USER"
				+" FROM "
				+" ("
				+" SELECT MIN(ID) AS ID,ARCHIVES_ID,ARCHIVESNO,CREATE_DATE,SUBJECT,ARCHTYPE,DATA_SOURCE,FROM_SCHEMA,CREATE_USER"
				+" from OA_COMMON.SYS_DATA_TRANSFER  "
				+" WHERE ARCHTYPE= "+archtype+" "+conditions
				+" GROUP BY ARCHIVES_ID,ARCHIVESNO,CREATE_DATE,SUBJECT,ARCHTYPE,DATA_SOURCE,FROM_SCHEMA,CREATE_USER"
				+" order by CREATE_DATE desc"
				+" ) C";
		Query q = getSession().createSQLQuery(sql);
		if (subject != null && !"".equals(subject))
			q.setParameter("subject", "%" + subject + "%");
		if (archivesno != null && !"".equals(archivesno))
			q.setParameter("archivesno", "%" + archivesno + "%"	);
		if (endtime != null && !"".equals(endtime))
			q.setParameter("endtime", endtime);
		if (creattime != null && !"".equals(creattime))
			q.setParameter("creattime", creattime );
		if (UserName != null && !"".equals(UserName))
			q.setParameter("UserName", UserName );
		List list = q.list();
		Long count = 0L;
		if (list != null) {
			count = new Long(list.size());
		}
		return count;
	}
}
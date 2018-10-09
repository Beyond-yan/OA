package com.gdssoft.oa.dao.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.oa.dao.communicate.SmsMobileDao;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class SmsMobileDaoImpl extends BaseDaoImpl<SmsMobile> implements SmsMobileDao{

	public SmsMobileDaoImpl() {
		super(SmsMobile.class);
	}

	@Override
	public List<SmsMobile> getNeedToSend() {
		String hql = "from SmsMobile sm where sm.status = ? order by sm.sendTime desc";
		Object[] params = {SmsMobile.STATUS_NOT_SENDED};
		return findByHql(hql, params);
	}
	
	/**
	 * 根据传进的参数查找相应的数据条数
	 */
	@Override
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId) {
		String connection = "";
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			connection += " and sm.userId = :userIds";	
		}
		if(null != depId){
			connection += " and au.depId = :depIds";
		}
		if(null != teamId){
			connection += " and ut.teamId = :teamIds";
		}
		if(null != sendTime){
			connection += " and sm.sendtime >= :sendtimes";
		}
		if(StringUtils.isNotBlank(recipients)){
			connection += " and sm.recipients like '%" + recipients + "%'";
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			connection += " and sm.phoneNumber like '%" + phoneNumber + "%'";
		}
		String sql = "SELECT count(*) "+
					"from (SELECT distinct sm.smsid, sm.sendtime, sm.recipients, sm.phonenumber, sm.userid, sm.username, sm.smscontent, sm.status, sm.recipients_id FROM SMS_MOBILE sm LEFT JOIN app_user au ON sm.recipients_id = au.userid " +
					"LEFT JOIN user_team ut ON sm.recipients_id = ut.userid where 1=1" + connection + 
					")";
		Query q = getSession().createSQLQuery(sql);
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			q.setParameter("userIds", userId);
		}
		if(null != depId){
			q.setParameter("depIds", depId);
		}
		if(null != teamId){
			q.setParameter("teamIds", teamId);
		}
		if(null != sendTime){
			q.setParameter("sendtimes", sendTime);
		}
		/*if(StringUtils.isNotBlank(recipients)){
			q.setParameter("recipientsName", "'%" + recipients + "%'");
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			q.setParameter("phoneNumbers", "'%" + phoneNumber + "%'");
		}*/
		List olist = q.list();
		BigDecimal count = null;
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}
	
	public List<SmsMobile> findSmsMobileBySchema(String schemaCode){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode  = schemaCode +".";
		else
			schemaCode  = "";
		String nsql = "SELECT * FROM "+ schemaCode +"sms_mobile a where a.STATUS=0" ;
		Query query = getSession().createSQLQuery(nsql).addEntity("a",SmsMobile.class);
		List<SmsMobile> smsMobileList= query.list();
		return smsMobileList;
	}
	
	public void updateSmsMobileStatus(String schemaCode,long smsId,int status){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode  = schemaCode +".";
		else
			schemaCode  = "";
		String nsql = "UPDATE "+ schemaCode +"sms_mobile  " 
			+ "SET status =:status,sendtime=sysdate"
				+" WHERE smsid=:smsId";
		Query query = getSession().createSQLQuery(nsql).setParameter("status", status)
				.setParameter("smsId", smsId);
		query.executeUpdate();
	}
	
	public void saveSmsMobileHis(String schemaCode,long smsId){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode  = schemaCode +".";
		else
			schemaCode  = "";
		String nsql = "INSERT INTO "+ schemaCode +"sms_history(smsid, sendtime, recipients, phonenumber, userid, username,"
				+" smscontent,status, recipients_id)" 
				+ " SELECT smsid, sendtime, recipients, phonenumber, userid, username, smscontent,status, recipients_id"
				+" FROM "+ schemaCode + "sms_mobile WHERE smsid=:smsId";
		Query query = getSession().createSQLQuery(nsql).setParameter("smsId", smsId);
		query.executeUpdate();
	}
	/**
	 * 删除不同schema下的短信
	 * @param schemaCode
	 * @param smsId
	 */
	public void delSmsMobile(String schemaCode,long smsId){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode  = schemaCode +".";
		else
			schemaCode  = "";
		String nsql = "DELETE "+ schemaCode +"sms_mobile " 
					+" WHERE smsid=:smsId";
		Query query = getSession().createSQLQuery(nsql).setParameter("smsId", smsId);
		query.executeUpdate();
	}
	
	/**
	 * 根据参数，查找相应的数据
	 */
	@Override
	public List<SmsMobile> findByDepAndTeam(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId){
		String connection = "";
		System.out.println(new Long(-1) == userId);
		System.out.println(new Long(1) == userId);
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			connection += "and sm.userId = :userIds";
		}
		if(null != depId){
			connection += " and au.depId = :depIds";
		}
		if(null != teamId){
			connection += " and ut.teamId = :teamIds";
		}
		if(null != sendTime){
			connection += " and sm.sendtime >= :sendtimes";
		}
		if(StringUtils.isNotBlank(recipients)){
			connection += " and sm.recipients like '%" + recipients +"%'";
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			connection += " and sm.phoneNumber like '%" + phoneNumber + "%'";
		}
		String sql = "SELECT distinct a.SMSID,to_char(a.SENDTIME,'YYYY-MM-DD HH24:MI:SS'),a.RECIPIENTS,a.PHONENUMBER,a.USERID,a.USERNAME,a.SMSCONTENT,a.STATUS,a.RECIPIENTS_ID "+
					"from (SELECT sm.smsid, sm.sendtime, sm.recipients, sm.phonenumber, sm.userid, sm.username, sm.smscontent, sm.status, sm.recipients_id FROM SMS_MOBILE sm LEFT JOIN app_user au ON sm.recipients_id = au.userid " +
					"LEFT JOIN user_team ut ON sm.recipients_id = ut.userid where 1=1" + connection + 
					") a  ORDER by SMSID DESC";
		Query q = getSession().createSQLQuery(sql)
				.setFirstResult(start).setMaxResults(size);
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			q.setParameter("userIds", userId);
		}
		if(null != depId){
			q.setParameter("depIds", depId);
		}
		if(null != teamId){
			q.setParameter("teamIds", teamId);
		}
		if(null != sendTime){
			q.setParameter("sendtimes", sendTime);
		}
		/*if(StringUtils.isNotBlank(recipients)){
			q.setParameter("recipientsName","'%" + recipients +"%'");
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			q.setParameter("phoneNumbers", "'%" + phoneNumber + "%'");
		}*/
		System.out.println(q.getQueryString());
		List list = q.list();
		List<SmsMobile> tempList = new ArrayList<SmsMobile>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			SmsMobile smsMobile = new SmsMobile();
			smsMobile.setSmsId(new Long(objs[0].toString()));
			try {
				smsMobile.setSendTime(sdf.parse(objs[1].toString()));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			smsMobile.setRecipients(objs[2].toString());
			smsMobile.setPhoneNumber(objs[3].toString());
			smsMobile.setUserId(new Long(objs[4].toString()));
			smsMobile.setUserName(objs[5].toString());
			smsMobile.setSmsContent(objs[6].toString());
			smsMobile.setStatus(Short.parseShort(objs[7].toString()));
			tempList.add(smsMobile);
		}
		System.out.println("hql=" + sql);
//		List<smsMobile> list = findByHql(hql, paramList.toArray());
		return tempList;
	}
	
	public void saveSmsMobile(String schemaCode, SmsMobile smsMobile) {
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode+".";
		String sql = "insert into " + schemaCode + "sms_mobile "
				+ " (smsid, sendtime, recipients, phonenumber, userid, username, smscontent, status, recipients_id) "
				+ " values "
				+ " (hibernate_sequence.nextval, sysdate, :recipients, :phoneNumber, :userId, :userName, :smsContent, :status, :recipientsId)";
		Query query = getSession().createSQLQuery(sql)
				.setParameter("recipients", smsMobile.getRecipients())
				.setParameter("phoneNumber", smsMobile.getPhoneNumber())
				.setParameter("userId", smsMobile.getUserId())
				.setParameter("userName", smsMobile.getUserName())
				.setParameter("smsContent", smsMobile.getSmsContent())
				.setParameter("status", smsMobile.getStatus())
				.setParameter("recipientsId", smsMobile.getRecipientsId().getUserId());
		query.executeUpdate();
	}

}
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

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.communicate.SmsHistoryDao;
import com.gdssoft.oa.model.communicate.SmsHistory;
import com.gdssoft.oa.model.system.AppUser;

public class SmsHistoryDaoImpl extends BaseDaoImpl<SmsHistory> implements SmsHistoryDao{

	public SmsHistoryDaoImpl() {
		super(SmsHistory.class);
	}
	
	/**
	 * 根据传进的参数查找相应的数据条数
	 */
	@Override
	public Long count(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId) {
		String connection = "";
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			connection += " and sh.userId = :userIds";
		}
		if(null != depId){
			connection += " and au.depId = :depIds";
		}
		if(null != teamId){
			connection += " and ut.teamId = :teamIds";
		}
		if(null != sendTime){
			connection += " and sh.sendtime >= :sendtimes";
		}
		if(StringUtils.isNotBlank(recipients)){
			connection += " and sh.recipients like '%" + recipients + "%'";
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			connection += " and sh.phoneNumber like '%" + phoneNumber + "%'";
		}
		String sql = "SELECT count(*) "+
					"from (SELECT distinct sh.smsid, sh.sendtime, sh.recipients, sh.phonenumber, sh.userid, sh.username, sh.smscontent, sh.status, sh.recipients_id FROM sms_history sh LEFT JOIN app_user au ON sh.recipients_id = au.userid " +
					"LEFT JOIN user_team ut ON sh.recipients_id = ut.userid where 1=1" + connection + 
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
	
	/**
	 * 根据参数，查找相应的数据
	 */
	@Override
	public List<SmsHistory> findByDepAndTeam(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId){
		String connection = "";
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			connection += " and sh.userId = :userIds";
		}
		if(null != depId){
			connection += " and au.depId = :depIds";
		}
		if(null != teamId){
			connection += " and ut.teamId = :teamIds";
		}
		if(null != sendTime){
			connection += " and sh.sendtime >= :sendtimes";
		}
		if(StringUtils.isNotBlank(recipients)){
			connection += " and sh.recipients like '%" + recipients +"%'";
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			connection += " and sh.phoneNumber like '%" + phoneNumber + "%'";
		}
		String sql = "SELECT distinct a.SMSID,to_char(a.SENDTIME,'YYYY-MM-DD HH24:MI:SS'),a.RECIPIENTS,a.PHONENUMBER,a.USERID,a.USERNAME,a.SMSCONTENT,a.STATUS,a.RECIPIENTS_ID "+
					"from (SELECT sh.smsid, sh.sendtime, sh.recipients, sh.phonenumber, sh.userid, sh.username, sh.smscontent, sh.status, sh.recipients_id FROM sms_history sh LEFT JOIN app_user au ON sh.recipients_id = au.userid " +
					"LEFT JOIN user_team ut ON sh.recipients_id = ut.userid where 1=1" + connection + 
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
		List<SmsHistory> tempList = new ArrayList<SmsHistory>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			SmsHistory smsHistory = new SmsHistory();
			smsHistory.setSmsId(new Long(objs[0].toString()));
			try {
				smsHistory.setSendTime(sdf.parse(objs[1].toString()));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			smsHistory.setRecipients(objs[2].toString());
			smsHistory.setPhoneNumber(objs[3].toString());
			smsHistory.setUserId(new Long(objs[4].toString()));
			smsHistory.setUserName(objs[5].toString());
			smsHistory.setSmsContent(objs[6].toString());
			smsHistory.setStatus(Short.parseShort(objs[7].toString()));
			tempList.add(smsHistory);
		}
		System.out.println("hql=" + sql);
//		List<SmsHistory> list = findByHql(hql, paramList.toArray());
		return tempList;
	}
	
	/**
	 * 根据传进的参数查找相应的数据条数(已发和待发的总和)
	 */
	@Override
	public Long countAll(Long depId,Long teamId, Date sendTime, String recipients, String phoneNumber, long userId){
		String connection1 = "";
		String connection2 = "";
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			connection1 += " and sh.userId = :userIds";	
			connection2 += " and sm.userId = :userIds";	
		}
		if(null != depId){
			connection1 += " and au.depId = :depIds";
			connection2 += " and au.depId = :depIds";
		}
		if(null != teamId){
			connection1 += " and ut.teamId = :teamIds";
			connection2 += " and ut.teamId = :teamIds";
		}
		if(null != sendTime){
			connection1 += " and sh.sendtime >= :sendtimes";
			connection2 += " and sm.sendtime >= :sendtimes";
		}
		if(StringUtils.isNotBlank(recipients)){
			connection1 += " and sh.recipients like '%" + recipients + "%'";
			connection2 += " and sm.recipients like '%" + recipients + "%'";
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			connection1 += " and sh.phoneNumber like '%" + phoneNumber + "%'";
			connection2 += " and sm.phoneNumber like '%" + phoneNumber + "%'";
		}
		String sql = "SELECT count(*) "+
					"from (SELECT distinct sh.smsid, sh.sendtime, sh.recipients, sh.phonenumber, sh.userid, sh.username, sh.smscontent, sh.status, sh.recipients_id FROM sms_history sh LEFT JOIN app_user au ON recipients_id = au.userid LEFT JOIN user_team ut ON sh.recipients_id = ut.userid where 1=1" + connection1 + 
					" union SELECT sm.smsid, sm.sendtime, sm.recipients, sm.phonenumber, sm.userid, sm.username, sm.smscontent, sm.status, sm.recipients_id FROM sms_mobile sm LEFT JOIN app_user au ON recipients_id = au.userid LEFT JOIN user_team ut ON sm.recipients_id = ut.userid where 1=1" + connection2 + 
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
	
	/**
	 * 根据参数，查找相应的数据(已发和待发的数据)
	 */
	@Override
	public List<SmsHistory> findByDepAndTeamAll(Long depId,Long teamId, int start, int size,
			Date sendTime, String recipients, String phoneNumber, long userId){
		String connection1 = "";
		String connection2 = "";
		if(!(new Long(-1) == userId || new Long(1) == userId)){
			connection1 += " and sm.userId = :userIds";
			connection2 += " and sh.userId = :userIds";
		}
		if(null != depId){
			connection1 += " and au.depId = :depIds";
			connection2 += " and au.depId = :depIds";
		}
		if(null != teamId){
			connection1 += " and ut.teamId = :teamIds";
			connection1 += " and ut.teamId = :teamIds";
		}
		if(null != sendTime){
			connection1 += " and sm.sendtime >= :sendtimes";
			connection2 += " and sh.sendtime >= :sendtimes";
		}
		if(StringUtils.isNotBlank(recipients)){
			connection1 += " and sm.recipients like '%" + recipients +"%'";
			connection2 += " and sh.recipients like '%" + recipients +"%'";
		}
		if(StringUtils.isNotBlank(phoneNumber)){
			connection1 += " and sm.phoneNumber like '%" + phoneNumber + "%'";
			connection2 += " and sh.phoneNumber like '%" + phoneNumber + "%'";
		}
		String sql = "SELECT distinct a.SMSID,to_char(a.SENDTIME,'YYYY-MM-DD HH24:MI:SS'),a.RECIPIENTS,a.PHONENUMBER,a.USERID,a.USERNAME,a.SMSCONTENT,a.STATUS,a.RECIPIENTS_ID "+
					"from (SELECT sm.smsid, sm.sendtime, sm.recipients, sm.phonenumber, sm.userid, sm.username, sm.smscontent, sm.status, sm.recipients_id" +
					" FROM sms_mobile sm LEFT JOIN app_user au ON recipients_id = au.userid LEFT JOIN user_team ut ON sm.recipients_id = ut.userid where 1=1" + connection1 + 
					" UNION SELECT sh.SMSID,sh.SENDTIME,sh.RECIPIENTS,sh.PHONENUMBER,sh.USERID,sh.USERNAME,sh.SMSCONTENT,sh.STATUS,sh.RECIPIENTS_ID"+
					" FROM sms_history sh LEFT JOIN app_user au ON recipients_id = au.userid LEFT JOIN user_team ut ON sh.recipients_id = ut.userid where 1=1"+ connection2 +
					") a  ORDER by a.SMSID DESC";
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
		List<SmsHistory> tempList = new ArrayList<SmsHistory>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		for(int i=0;i<list.size();i++){
			Object[] objs = (Object[])list.get(i);
			SmsHistory smsHistory = new SmsHistory();
			smsHistory.setSmsId(new Long(objs[0].toString()));
			try {
				smsHistory.setSendTime(sdf.parse(objs[1].toString()));
			} catch (ParseException e) {
				e.printStackTrace();
			}
			smsHistory.setRecipients(objs[2].toString());
			smsHistory.setPhoneNumber(objs[3].toString());
			smsHistory.setUserId(new Long(objs[4].toString()));
			smsHistory.setUserName(objs[5].toString());
			smsHistory.setSmsContent(objs[6].toString());
			smsHistory.setStatus(Short.parseShort(objs[7].toString()));
			tempList.add(smsHistory);
		}
		System.out.println("hql=" + sql);
//		List<smsMobile> list = findByHql(hql, paramList.toArray());
		return tempList;
	}

}
package com.gdssoft.oa.dao.leaderActivities.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.leaderActivities.LeaderActivitiesDao;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.system.AppUser;

public class LeaderActivitiesDaoImpl extends BaseDaoImpl<LeaderActivities>
		implements LeaderActivitiesDao {

	public LeaderActivitiesDaoImpl(){
		super(LeaderActivities.class);
	}
	
	@Override
	public List<LeaderActivities> Weileader(String schamal,String startDate,String endDate, Long activeId){
		ArrayList<LeaderActivities> LeaderActivi= new ArrayList<LeaderActivities>();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String conditions = "";
		if (startDate != null && !"".equals(startDate))
			conditions += " and la.end_time>=:startDate";
		if (endDate != null && !"".equals(endDate))
			conditions += " and la.start_time<=:endDate";
		if (activeId != null && !"".equals(activeId))
			conditions += " and la.active_Id=:activeId";
		String sql="select {la.*},{b.*}  from "+schamal+".CQ_LEADERS_ACTIVITIES la join "+schamal+".app_user  b on LA.LEADER_ID=B.USERID where 1=1 and LA.data_sources = 0 "+conditions+" order by b.user_level asc ";
		Query q = getSession().createSQLQuery(sql)
				.addEntity("la", LeaderActivities.class).addEntity("b", AppUser.class);
		Date sdt = null;
		Date edt=null;
		if (startDate != null && !"".equals(startDate)){
			try {
				sdt = formatter.parse(startDate);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			q.setParameter("startDate", sdt);}
		if (endDate != null && !"".equals(endDate)){
			try {
				edt = formatter.parse(endDate);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			q.setParameter("endDate",  edt);}
		if (activeId != null && !"".equals(activeId))
			q.setParameter("activeId",  activeId);
		List list = q.list();
		for(int i =0; i<list.size(); i++){
			Object[] objects = (Object[])list.get(i);
			LeaderActivities leaderActivities=(LeaderActivities)objects[0];
			AppUser appUser = (AppUser)objects[1];
		
			leaderActivities.setAppUser(appUser);
			LeaderActivi.add(leaderActivities);
		}
		return LeaderActivi;
	}

	@Override
	public int insertArchiveActive(String schemaCode, Long archivesId, Long activeId) {
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode +".";
		String removehql = "delete " + schemaCode + "archives_active where archives_id = " + archivesId + " and active_id = " + activeId;
		Query removeQuery = getSession().createSQLQuery(removehql);
		int removeReturn =  removeQuery.executeUpdate();
		
		String hql = "INSERT INTO " + schemaCode + "archives_active(archives_id, active_id)"
				+" VALUES(:archivesId,:activeId)";
		Query query = getSession().createSQLQuery(hql)
				.setParameter("archivesId", archivesId)
				.setParameter("activeId", activeId);
		return query.executeUpdate();
	}

	@Override
	public LeaderActivities findByArchivesIdAndUserId(String schema, Long archivesId,
			Long userId) {
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		String sql = "select la.* from " + schema + "CQ_LEADERS_ACTIVITIES la left join " + schema + "archives_active aa on aa.active_id = la.active_id"
				+ " where la.leader_id = :userId and aa.archives_id = :archivesId";
		Query query = this.getSession().createSQLQuery(sql).addEntity("la", LeaderActivities.class)
				.setParameter("userId", userId)
				.setParameter("archivesId", archivesId);
		List<LeaderActivities> list = query.list();
		if(list.size() > 0){
			return list.get(0);
		}else{
			return null;
		}
	}

	@Override
	public int removeArchivesActive(String schemaCode, Long activeId) {
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode +".";
		String hql = "delete " + schemaCode + "archives_active where active_id = " + activeId;
		Query query = getSession().createSQLQuery(hql);
		return query.executeUpdate();
	}

	@Override
	public int removeActiveByArchiveId(String schema, Long archivesId) {
		if(StringUtils.isNotBlank(schema))
			schema = schema +".";
		String removeActivehql = "delete " + schema + "CQ_LEADERS_ACTIVITIES la where la.active_id in (select aa.active_id from " + schema + "archives_active aa where aa.archives_id = " + archivesId + ")";
		String hql = "delete " + schema + "archives_active where archives_id = " + archivesId;
		Query removeActiveQuery = getSession().createSQLQuery(removeActivehql);
		int removeActiveReturn =  removeActiveQuery.executeUpdate();
		Query query = getSession().createSQLQuery(hql);
		int removeReturn = query.executeUpdate();
		return removeActiveReturn*removeReturn;
	}
	
	@Override
	public List<LeaderActivities> findActiveByArchiveId(String schamal, Long archivesId){
		ArrayList<LeaderActivities> LeaderActivi= new ArrayList<LeaderActivities>();
		String sql="select {la.*},{b.*}  from "+schamal+".CQ_LEADERS_ACTIVITIES la"
				+ " join "+schamal+".app_user  b on LA.LEADER_ID=B.USERID"
				+ " left join " + schamal + ".archives_active aa on aa.active_id = la.active_id" 
				+ " where aa.archives_id=:archivesId";
		Query q = getSession().createSQLQuery(sql)
				.addEntity("la", LeaderActivities.class).addEntity("b", AppUser.class);
			q.setParameter("archivesId",  archivesId);
		List list = q.list();
		for(int i =0; i<list.size(); i++){
			Object[] objects = (Object[])list.get(i);
			LeaderActivities leaderActivities=(LeaderActivities)objects[0];
			AppUser appUser = (AppUser)objects[1];
		
			leaderActivities.setAppUser(appUser);
			LeaderActivi.add(leaderActivities);
		}
		return LeaderActivi;
	}
	
	@Override
	public List<LeaderActivities> findActiveByNoticeIdAndDepId(String schamal, Long noticeId, Long depId){
		ArrayList<LeaderActivities> LeaderActivi= new ArrayList<LeaderActivities>();
		String sql="select {la.*},{b.*}  from "+schamal+".CQ_LEADERS_ACTIVITIES la"
				+ " join "+schamal+".app_user  b on LA.LEADER_ID=B.USERID"
				+ " left join " + schamal + ".archives_active aa on aa.active_id = la.active_id" 
				+ " where aa.archives_id=:archivesId and b.depid=:depId";
		Query q = getSession().createSQLQuery(sql)
				.addEntity("la", LeaderActivities.class).addEntity("b", AppUser.class);
			q.setParameter("archivesId",  noticeId).setParameter("depId", depId);
		List list = q.list();
		for(int i =0; i<list.size(); i++){
			Object[] objects = (Object[])list.get(i);
			LeaderActivities leaderActivities=(LeaderActivities)objects[0];
			AppUser appUser = (AppUser)objects[1];
		
			leaderActivities.setAppUser(appUser);
			LeaderActivi.add(leaderActivities);
		}
		return LeaderActivi;
	}
}

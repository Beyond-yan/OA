package com.gdssoft.oa.dao.meetingTimes.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.meetingTimes.MeetingTimesDao;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.meetingTimes.MeetingTimes;

public class MeetingTimesDaoImpl extends BaseDaoImpl<MeetingTimes>
implements MeetingTimesDao {

	public MeetingTimesDaoImpl() {
		super(MeetingTimes.class);
	}

	@Override
	public List<MeetingTimes> getByCondition(String year, String times, String type) {
		String schema = "";
		if(null != ContextUtil.getCurrentUser()){
    		if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
    			schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		String hql = "SELECT mt.* FROM " + schema + "MEETING_TIMES mt where  1=1 ";
		if(StringUtils.isNotBlank(year))
			hql += " and mt.year = " + year;
		if(StringUtils.isNotBlank(times))
			hql += " and mt.times = " + times;
		if(StringUtils.isNotBlank(type))
			hql += " and mt.type = " + type;
		hql += " order by mt.type,mt.year desc,mt.times desc";
		Query query = getSession().createSQLQuery(hql).addEntity("mt",MeetingTimes.class);
		List<Archives> list = query.list();
		return query.list();
	}

	@Override
	public int setTimes(String archivesId, String timesId, String times) {
		String schame = ContextUtil.getCurrentUser().getOwnerSchema() + ".";
		
		String hql = "update " + schame + "archives t set t.keywords = " + timesId + ", t.privacyLevel = '" + times + "' where t.archivesid = " + archivesId;
		Query query = getSession().createSQLQuery(hql);
		return query.executeUpdate();
	}

	@Override
	public int setTimesAndNo(String archivesId, String num, String timesId, String times) {
		String schame = ContextUtil.getCurrentUser().getOwnerSchema() + ".";
		
		String hql = "update " + schame + "archives t set t.urgentlevel = " + num + ",t.keywords = " + timesId + ", t.privacyLevel = '" + times + "' where t.archivesid = " + archivesId;
		Query query = getSession().createSQLQuery(hql);
		return query.executeUpdate();
	}

	@Override
	public int setNumber(String archivesId, String number) {
String schame = ContextUtil.getCurrentUser().getOwnerSchema() + ".";
		
		String hql = "update " + schame + "archives t set t.urgentLevel = '" + number + "' where t.archivesid = " + archivesId;
		Query query = getSession().createSQLQuery(hql);
		return query.executeUpdate();
	}

}

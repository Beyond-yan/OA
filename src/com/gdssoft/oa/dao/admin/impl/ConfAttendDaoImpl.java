package com.gdssoft.oa.dao.admin.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.oa.dao.admin.ConfAttendDao;
import com.gdssoft.oa.model.admin.ConfAttend;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

/**
 * @description ConfAttendDaoImpl
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
@SuppressWarnings("unchecked")
public class ConfAttendDaoImpl extends BaseDaoImpl<ConfAttend> implements
		ConfAttendDao {

	public ConfAttendDaoImpl() {
		super(ConfAttend.class);
	}

	@Override
	public List<ConfAttend> getConfAt(Long confID) {
		// TODO Auto-generated method stub
	
		ArrayList<Object> paramList = new ArrayList<Object>();
	
		/*String hql = "select t from Conference t where t.confId = ? and t.status=1 and ";
		hql += "t.startTime <= to_date(?,'yyyy-mm-dd hh24:mi:ss') and t.endTime >= to_date(?,'yyyy-mm-dd hh24:mi:ss') ";
		*/
		String hql = "from ConfAttend t where t.confId.confId = ? ";
		
	
		//paramList.add(confID);
		Object[] objs={confID};
		
		List<ConfAttend> list = findByHql(hql, objs);
		
		return list;
		
		
		
	}
	
	public void delete(final Long confId){
		getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
					Query query = session.createQuery(
							"delete ConfAttend c where c.confId =?");
					query.setLong(0, confId);
					query.executeUpdate();
				return null;
			}
		});
	}

	
	
	
	
	
	
	
	
	
	
	
}
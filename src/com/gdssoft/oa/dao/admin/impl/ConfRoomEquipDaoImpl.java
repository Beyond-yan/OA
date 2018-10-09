package com.gdssoft.oa.dao.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.sql.SQLException;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.ConfRoomEquipDao;
import com.gdssoft.oa.model.admin.ConfRoomEquip;

@SuppressWarnings("unchecked")
public class ConfRoomEquipDaoImpl extends BaseDaoImpl<ConfRoomEquip> implements ConfRoomEquipDao{

	public ConfRoomEquipDaoImpl() {
		super(ConfRoomEquip.class);
	}
	
	public void delete(final Long roomId){
		getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
					Query query = session.createQuery(
							"delete ConfRoomEquip c where c.Boardroo =?");
					query.setLong(0, roomId);
					query.executeUpdate();
				return null;
			}
		});
	}

}
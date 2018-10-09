package com.gdssoft.oa.dao.admin.impl;

import java.sql.SQLException;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarCostRecordDetailDao;
import com.gdssoft.oa.model.admin.CarCostRecordDetail;

public class CarCostRecordDetailDaoImpl extends
		BaseDaoImpl<CarCostRecordDetail> implements CarCostRecordDetailDao {

	public CarCostRecordDetailDaoImpl() {
		super(CarCostRecordDetail.class);
		// TODO Auto-generated constructor stub
	}
	
	
	/**
	 * @description 根据费用记录表recordId删除费用详细记录表
	 * @param 
	 */
	public void deleteByRecordId(Long recordId) {
		getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
					Query query = session.createQuery(
							"delete car_cost_Record_detail c where c.record_id =?");
					query.executeUpdate();
				return null;
			}
		});
	}


}

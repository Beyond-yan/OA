package com.gdssoft.oa.dao.out.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.out.OutPersonDao;
import com.gdssoft.oa.model.out.OutPerson;
import com.gdssoft.oa.model.system.Department;

public class OutPersonDaoImpl extends BaseDaoImpl<OutPerson> implements
		OutPersonDao {

	public OutPersonDaoImpl() {
		super(OutPerson.class);

	}

	@Override
	public Long count(int deleted, String fullname, String depName, Date sdt,
			Date edt) {
		String conditions = "";
		if (fullname != null && !"".equals(fullname))
			conditions += " and b.fullname like :fullname";
		if (sdt != null)
			conditions += " and a.START_DATE >= :sdt";
		if (edt != null)
			conditions += " and a.START_DATE <= :edt";
		if (deleted != 9 && !"".equals(deleted))
			conditions += " and a.deleted=:deleted";
		String sql = "SELECT count(*) "
				+ "FROM (SELECT id,user_id,destination_address,out_reson,start_date,end_date,work_consign,zip_code,contact_address,contact_name,telphone,mobilephone,fax,create_user,create_date,update_user,update_date, 2 AS deleted FROM cq_outworker_register a WHERE start_date <= TRUNC (SYSDATE,'HH24') AND end_date > TRUNC (SYSDATE,'HH24') UNION SELECT id,user_id,destination_address,out_reson,start_date,end_date,work_consign,zip_code,contact_address,contact_name,telphone,mobilephone,fax,create_user,create_date,update_user,update_date, 0 AS deleted FROM cq_outworker_register a WHERE end_date <= TRUNC (SYSDATE,'HH24') UNION SELECT id,user_id,destination_address,out_reson,start_date,end_date,work_consign,zip_code,contact_address,contact_name,telphone,mobilephone,fax,create_user,create_date,update_user,update_date, 1 AS deleted FROM cq_outworker_register a WHERE start_date > TRUNC (SYSDATE,'HH24')) a "
				+ "JOIN app_user b ON a.user_id = b.userid JOIN department c ON b.depid = c.depid  "
				+ "where c.DEPNAME like :dep  " + conditions + " order by deleted desc " ;

		Query q = getSession().createSQLQuery(sql).setParameter("dep",
				"%" + depName + "%");

		if (fullname != null && !"".equals(fullname))
			q.setParameter("fullname", "%" + fullname + "%");
		if (sdt != null)
			q.setParameter("sdt", sdt);
		if (edt != null)
			q.setParameter("edt", edt);
		if (deleted != 9 && !"".equals(deleted))
			q.setParameter("deleted", deleted);
		List olist = q.list();
		BigDecimal count = null;
		if (olist != null) {
			count = (BigDecimal) olist.get(0);
		}
		return count.longValue();
	}

	@Override
	public List<OutPerson> find(int deleted, String fullname, String depName,
			Date sdt, Date edt, int size, int start) {
		String conditions = "";
		if (fullname != null && !"".equals(fullname))
			conditions += " and b.fullname like :fullname";
		if (sdt != null)
			conditions += " and a.START_DATE >= :sdt";
		if (edt != null)
			conditions += " and a.START_DATE < :edt";
		if (deleted != 9 && !"".equals(deleted))
			conditions += " and a.deleted=:deleted";
		String sql = "SELECT {a.*},{b.*},{c.*} "
				+ " FROM (SELECT id,user_id,destination_address,out_reson,start_date,end_date,work_consign,zip_code,contact_address,contact_name,telphone,mobilephone,fax,create_user,create_date,update_user,update_date, 2 AS deleted FROM cq_outworker_register a WHERE start_date <= TRUNC (SYSDATE,'HH24') AND end_date > TRUNC (SYSDATE,'HH24') UNION SELECT id,user_id,destination_address,out_reson,start_date,end_date,work_consign,zip_code,contact_address,contact_name,telphone,mobilephone,fax,create_user,create_date,update_user,update_date, 0 AS deleted FROM cq_outworker_register a WHERE end_date <= TRUNC (SYSDATE,'HH24') UNION SELECT id,user_id,destination_address,out_reson,start_date,end_date,work_consign,zip_code,contact_address,contact_name,telphone,mobilephone,fax,create_user,create_date,update_user,update_date,1 AS deleted FROM cq_outworker_register a WHERE start_date > TRUNC (SYSDATE,'HH24')) a "
				+ " JOIN app_user b ON a.user_id = b.userid JOIN department c ON b.depid = c.depid "
				+ " where  c.DEPNAME like :dep "
				+ conditions + " order by deleted desc " ;
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a", OutPerson.class)
				.addEntity("c", Department.class).addJoin("b", "a.appUser")
				.setParameter("dep", "%" + depName + "%").setFirstResult(start).setMaxResults(size);
		if (fullname != null && !"".equals(fullname))
			q.setParameter("fullname", "%" + fullname + "%");
		if (sdt != null)
			q.setParameter("sdt", sdt);
		if (edt != null)
			q.setParameter("edt", edt);
		if (deleted != 9 && !"".equals(deleted))
			q.setParameter("deleted", deleted);
		List olist = q.list();
		List<OutPerson> list = new ArrayList<OutPerson>();
		for (Object object : olist) {
			Object[] objs = (Object[]) object;
			for (Object obj : objs) {
				if (obj.getClass().getName()
						.equals("com.gdssoft.oa.model.out.OutPerson")) {
					OutPerson op = (OutPerson) obj;
					list.add(op);
					break;
				}
			}
		}

		return list;
	}

}

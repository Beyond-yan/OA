package com.gdssoft.oa.dao.summary.impl;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ParamUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.summary.DepartmentSummaryDao;
import com.gdssoft.oa.model.summary.DepartmentSummary;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.summary.WorkSummarySum;

public class DepartmentSummaryDaoImpl extends BaseDaoImpl<DepartmentSummary>
		implements DepartmentSummaryDao {

	private ArrayList<Object> paramList = new ArrayList<Object>();

	public DepartmentSummaryDaoImpl() {
		super(DepartmentSummary.class);
		// TODO Auto-generated constructor stub
	}

	public List getAllbySumId(final HttpServletRequest request,
			QueryFilter queryFilter) {
		WorkSummarySum workSummarySum = (WorkSummarySum) request
				.getAttribute("workSummarySum");
		String hqlcond = createConditions(request);
		String hql = "from DepartmentSummary dep left join dep.summaries  worksum "
				+ "where worksum.summaryid is null or (worksum.summaryid>0 ";
		if (hqlcond.length() > 0) {
			hql = hql + hqlcond;
		}
		hql = hql + ")";
		System.out.println("Hql String:" + hql);
		List<DepartmentSummary> list = findByHql(hql, paramList.toArray(),
				queryFilter.getPagingBean());
		return list;
	}

	public List getAll(final HttpServletRequest request, QueryFilter queryFilter) {
		// 设置总记录数
		WorkSummarySum workSummarySum = (request.getAttribute("workSummarySum") == null ? null
				: (WorkSummarySum) request.getAttribute("workSummarySum"));
		String hqlcond = "";
//		if (workSummarySum != null)// 如果存在sumid,加载数据
//		{
//			hqlcond = createConditions(workSummarySum);
//		} else// 按照条件查询数据
//		{
//			hqlcond = createConditions(request);
//		}
//		String sql = " select * from Department dep left join (select * from Work_Summary worksum " 
//			+ " where worksum.summaryid>0 " ;//查询关联表
		String hql = " from DepartmentSummary dep left join dep.summaries  worksum where dep.deplevel=3";
//		String hql = "from DepartmentSummary dep left join dep.summaries  worksum "
//				+ "where dep.deplevel=3 and (worksum.summaryid is null or (worksum.summaryid>0 "; //查询关联表
		if (hqlcond.length() > 0) {
			hql = hql + hqlcond;//整个关联表进行条件过滤
//			sql = sql + hqlcond;//右侧子表条件过滤
		}
		
		//查询所有关联
		hql = hql + "))";
		List<DepartmentSummary> list = searchByHql(hql, paramList.toArray(),
				queryFilter.getPagingBean(),request);
		
		//查出所有关联右侧（已经过滤）后为空的上级部门数据
//		sql = sql + " ) wsum on wsum.deptid=dep.depid "
//				  + " where dep.deplevel=3 and wsum.summaryid is null ";
//		System.out.println("--------------------Sql String: "+ sql);		
//		List listsql = jdbcTemplate.queryForList(sql);
//		Iterator it = listsql.iterator();
		
		//把所有关联右侧（已经过滤）后为空的上级部门数据追加到list
//		while(it.hasNext())
//		{
//			Map ucmap = (Map)it.next();
//			DepartmentSummary departmentSum = new DepartmentSummary();
//			departmentSum.setDepid((Long)ucmap.get("depId"));
//			departmentSum.setDeplevel((Long)ucmap.get("depLevel"));
//			departmentSum.setDepname(ucmap.get("depName").toString());
//			departmentSum.setDepdesc(ucmap.get("depDesc")==null?"":ucmap.get("depDesc").toString());
//			departmentSum.setFax(ucmap.get("fax")==null?"":ucmap.get("fax").toString());
//			departmentSum.setParentid((Long)ucmap.get("parentId"));
//			departmentSum.setPath(ucmap.get("path").toString());
//			departmentSum.setPhone(ucmap.get("phone")==null?"":ucmap.get("phone").toString());
//			departmentSum.setSummaries(null);
//			list.add(departmentSum);
//		}
		return list;
	}

	private String createConditions(WorkSummarySum workSummarySum) {
		String hql = "";
		paramList.clear();

		hql = hql + " and worksum.yearNo=?";
		paramList.add(workSummarySum.getYearNo());
		hql = hql + " and worksum.summarytype=?";
		paramList.add(workSummarySum.getType());
		hql = hql + " and worksum.typeNo=?";
		paramList.add(workSummarySum.getTypeNo());
		return hql;
	}

	private String createConditions(HttpServletRequest request) {
		String hql = "";
		paramList.clear();
		if (request.getParameterValues("Q_yearNo_N_EQ") != null
				&& !request.getParameterValues("Q_yearNo_N_EQ")[0].isEmpty()) {
			hql = hql + " and worksum.yearNo=?";
			paramList.add(Integer.parseInt(request
					.getParameterValues("Q_yearNo_N_EQ")[0]));
		}
		if (request.getParameterValues("Q_summarytype_S_EQ") != null
				&& !request.getParameterValues("Q_summarytype_S_EQ")[0]
						.isEmpty()) {
			hql = hql + " and worksum.summarytype=?";
			paramList.add(request.getParameterValues("Q_summarytype_S_EQ")[0]);
		}
		if (request.getParameterValues("Q_typeNo_N_EQ") != null
				&& !request.getParameterValues("Q_typeNo_N_EQ")[0].isEmpty()) {
			hql = hql + " and worksum.typeNo=?";
			paramList.add(Integer.parseInt(request
					.getParameterValues("Q_typeNo_N_EQ")[0]));
		}
		// Enumeration paramEnu= request.getParameterNames();
		// while(paramEnu.hasMoreElements()){
		// String paramName=(String)paramEnu.nextElement();
		// if(paramName.startsWith("Q_")){
		// String paramValue=(String)request.getParameter(paramName);
		// hql = getFilter(paramName,paramValue);
		// }
		// }
		return hql;

	}
	@SuppressWarnings("unchecked")
	private List<DepartmentSummary> searchByHql(final String hql,final Object[]objs,
			final int firstResult,final int pageSize,final HttpServletRequest request){
		return (List)getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
				session.enableFilter("isauthorizedfilter").setParameter("isAuthorized",1);
				WorkSummarySum workSummarySum = (request.getAttribute("workSummarySum") == null ? null
						: (WorkSummarySum) request.getAttribute("workSummarySum"));
				String hqlcond = "";
				if (workSummarySum != null)// 如果存在sumid,加载数据
				{
					session.enableFilter("typenofilter").setParameter("typeNo",workSummarySum.getType() );
					session.enableFilter("yearnofilter").setParameter("yearNo",workSummarySum.getTypeNo() );
					session.enableFilter("typefilter").setParameter("summarytype",workSummarySum.getYearNo());
				} else// 按照条件查询数据
				{
					if (request.getParameter("Q_yearNo_N_EQ") != null
							&& !request.getParameter("Q_yearNo_N_EQ").isEmpty()){
						int yearNo=Integer.parseInt(request.getParameter("Q_yearNo_N_EQ"));
						session.enableFilter("yearnofilter").setParameter("yearNo",yearNo);	
						System.out.println(session.getEnabledFilter("yearnofilter").getFilterDefinition());
						
					}
					if (request.getParameter("Q_summarytype_S_EQ") != null
							&& !request.getParameter("Q_summarytype_S_EQ").isEmpty()){
						session.enableFilter("typefilter").setParameter("summarytype",request.getParameter("Q_summarytype_S_EQ"));	
					}
					if (request.getParameter("Q_typeNo_N_EQ") != null
							&& !request.getParameter("Q_typeNo_N_EQ").isEmpty()){
						session.enableFilter("typenofilter").setParameter("typeNo",Integer.parseInt(request.getParameter("Q_typeNo_N_EQ")));
					}

				}
				Query query=session.createQuery(hql);
				query.setFirstResult(firstResult).setMaxResults(pageSize);
				if(objs!=null){
					for(int i=0;i<objs.length;i++){
						query.setParameter(i,objs[i]);
					}
				}
				return (List<DepartmentSummary>)query.list();
			}
		});
	}
	
	private List<DepartmentSummary> searchByHql(final String hql,final Object[]objs,PagingBean pb,
				final HttpServletRequest request){
		int totalItems=getTotalItems(hql,objs).intValue();
		pb.setTotalItems(totalItems);
		return searchByHql(hql,objs,pb.getFirstResult(),pb.getPageSize(),request);
	}
}

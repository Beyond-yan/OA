package com.gdssoft.oa.dao.info.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;
import org.hibernate.Transaction;

import com.gdssoft.oa.dao.info.NewsDao;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.summary.WorkSummary;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class NewsDaoImpl extends BaseDaoImpl<News> implements NewsDao{
	
	public NewsDaoImpl() {
		super(News.class);
	}

	@Override
	public List<News> findByTypeId(final Long typeId,final PagingBean pb) {
		//final String hql = "from News n where n.newsType.typeId=?";
		final String hql = "from News n where n.typeId=?";//edit by smart on 20110512
		Object[] params ={typeId};
		return findByHql(hql, params, pb);
	}

	@Override
	public List<News> findBySearch(String searchContent,PagingBean pb) {
		ArrayList params=new ArrayList();
		StringBuffer hql = new StringBuffer("from News n where n.status = ?");
		params.add(Constants.FLAG_ACTIVATION);	
		if(StringUtils.isNotEmpty(searchContent)){
			hql.append(" and (n.subject like ? or n.content like ?)");
			params.add("%"+searchContent+"%");
			params.add("%"+searchContent+"%");
		}
		hql.append(" order by n.updateTime desc");
		return findByHql(hql.toString(),params.toArray(), pb);
	}
	//add by smart on 20110520  新增了审核状态栏位
	@Override
	public List<News> findBySearch(String searchContent,Integer auditingStatus,PagingBean pb) {
		ArrayList params=new ArrayList();
		StringBuffer hql = new StringBuffer("from News n where n.status = ?");
		params.add(Constants.FLAG_ACTIVATION);	
		if(StringUtils.isNotEmpty(searchContent)){
			hql.append(" and (n.subject like ? or n.content like ?)");
			params.add("%"+searchContent+"%");
			params.add("%"+searchContent+"%");
		}
		hql.append(" and n.auditingStatus=? order by n.updateTime desc");
		params.add(auditingStatus);
		return findByHql(hql.toString(),params.toArray(), pb);
	}
	@Override
	public List<News> findImageNews(PagingBean pb) {
		String hql="from News vo where vo.isDeskImage=1 order by vo.updateTime desc";
		return findByHql(hql,new Object[]{},pb);
	}

	@Override
	public List<News> getDaibanNews(AppUser user,PagingBean pb) {
		// TODO Auto-generated method stub
/*  			String sqlUserId="select userid from app_user where username='"+empId +"'";
			int userId=this.jdbcTemplate.queryForInt(sqlUserId);
			//判断当前用户是否有相关审核权限
			String sqlCharge="select count(1) from user_role where userid="+ userId +"  and  roleid in ("+ 
			" select roleid from app_role where rolename in('公司新闻审核','人事信息审核','党群信息审核','企业文化审核','服务资讯审核'," +
			" '运营公司文件审核','总公司文件审核','运营公司会议纪要审核','总公司会议纪要审核','其它会议纪要审核','外来文件审核','外来通知审核')"+
			")";
			int countNum=this.jdbcTemplate.queryForInt(sqlCharge); 
			if(countNum>0){
				String hql=" from News n  where n.auditingStatus=0  ";
			List<News> newsList=findByHql(hql); 
			return newsList;
		}
		else {
			return null; 
		} */ 
		List<News> list = new ArrayList<News>();
		boolean isAdmin = false;
		for (AppRole role : (user.getRoles()).toArray(new AppRole[0])) {
			if (role.getRoleId() == -1L)// 管理员权限
			{
				isAdmin = true;
				break;
			}
		}
		String hql= "";
		String condstr = "";
		ArrayList<Object> paramList = new ArrayList<Object>();
		hql = " from News n  where n.auditingStatus=0 ";
		if (!isAdmin)// 非管理员需要过滤所在部门
		{
			if (user.getUserId() == user.getDepartment().getAppUser().getUserId())
			{				
				//condstr = " and n.department.id=? ";
				condstr = " and n.depId=? ";
				hql += condstr;	
				paramList.add(user.getDepartment().getDepId());								
				list = findByHql(hql, paramList.toArray(),pb);
			}
		}
		else
		{
			list = findByHql(hql, paramList.toArray(),pb);
		}						
		return list;
	}
}



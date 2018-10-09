package com.gdssoft.oa.action.info;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.security.Authentication;
import org.springframework.security.context.SecurityContextHolder;

import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.info.NewsType;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.info.NewsService;
import com.gdssoft.oa.service.info.NewsTypeService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.opensymphony.xwork2.Action;

import flexjson.JSONSerializer;

/**
 * 
 * @author csx
 * 
 */
public class NewsAction extends BaseAction {
	@Resource
	private NewsService newsService;
	@Resource
	private NewsTypeService newsTypeService;

	private News news;
	private List<News> list;

	public List<News> getList() {
		return list;
	}

	public void setList(List<News> list) {
		this.list = list;
	}

	private Long newsId;

	private Long typeId;

	private NewsType newsType;

	public Long getTypeId() {
		return typeId;
	}

	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}

	public Long getNewsId() {
		return newsId;
	}

	public void setNewsId(Long newsId) {
		this.newsId = newsId;
	}

	public News getNews() {
		return news;
	}

	public void setNews(News news) {
		this.news = news;
	}

	public NewsType getNewsType() {
		return newsType;
	}

	public void setNewsType(NewsType newsType) {
		this.newsType = newsType;
	}

	private String actionFlag;

	public String getActionFlag() {
		return actionFlag;
	}

	public void setActionFlag(String actionFlag) {
		this.actionFlag = actionFlag;
	}

	// add by smart on 20110514
	private String auditingAction;

	public String getAuditingAction() {
		return auditingAction;
	}

	public void setAuditingAction(String auditingAction) {
		this.auditingAction = auditingAction;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		// 获取当前用户
		Authentication auth = SecurityContextHolder.getContext()
				.getAuthentication();
		AppUser user = (AppUser) auth.getPrincipal();
		Long depId = user.getDepartment().getDepId();

		QueryFilter filter = new QueryFilter(getRequest()); 
 			if (this.actionFlag != null&&!this.actionFlag.trim().equals("")&&!this.actionFlag.equals("undefined")) {
				if (this.actionFlag.equals(0)) {
					filter.addFilter("Q_depId_L_EQ", "0");// add by smart on  20110512 0代表公司级的
				}
			}
			else
			{
				filter.addFilter("Q_depId_L_EQ", depId.toString());// add by smart on  20110512　除零以外的部门级的资料
			}
 	 	
 		//filter.addFilter("Q_status_SN_EQ", "0");	//0代表失效
 		
 		filter.addSorted("ordertop","desc");
 		//filter.addSorted("createtime", "desc");
 		filter.addSorted("updateTime", "desc");

		List<News> list = newsService.getAll(filter);
		Type type = new TypeToken<List<News>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.setDateFormat("yyyy-MM-dd").create();
		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();
		System.out.println("jsonString: " + jsonString);
		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				newsService.remove(new Long(id));
			}
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		News news = newsService.get(newsId);

		// Gson gson=new Gson();
		JSONSerializer serializer = new JSONSerializer();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(serializer.exclude(new String[] { "class", "newsComments" })
				.serialize(news));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {

		// 获取当前用户
		Authentication auth = SecurityContextHolder.getContext()
				.getAuthentication();
		AppUser user = (AppUser) auth.getPrincipal();
		Long depId = user.getDepartment().getDepId();

		String isDeskNews = getRequest().getParameter("isDeskImage");
		if (StringUtils.isNotEmpty(isDeskNews)) {
			news.setIsDeskImage(News.ISDESKNEWS);
		} else {
			news.setIsDeskImage(News.NOTDESKNEWS);
		}
		News old = new News();
		Boolean isNew = false;
		if (news.getNewsId() == null) {
			isNew = true;
		}
		if (news.getTypeId() != null) {
			// setNewsType(newsTypeService.get(news.getTypeId()));
			// news.setNewsType(newsType);
			// news.setTypeId(this.typeId);
		}
		// 新增
		if (isNew) {
 /*			if (this.actionFlag != null&&!this.actionFlag.trim().equals("")&&!this.actionFlag.equals("undefined")) {

				if (this.actionFlag.equals("0")) {
					news.setDepId(0L);// 如果用户点击的是左边菜单的公司新闻管理,则赋depId为0L
 				}
			} else {
				news.setDepId(depId);// 如果用户点击的是左边菜单的部门新闻管理,则赋depId为登录用户的部门ID
			}*/
			
			news.setDepId(depId);// 如果用户点击的是左边菜单的部门新闻管理,则赋depId为登录用户的部门ID

			news.setCreatetime(new Date());
			news.setUpdateTime(new Date());
			news.setReplyCounts(0);
			news.setViewCounts(0);
			news.setAuditingStatus(0);

			news.setOrdertop(0);//未置顶
			newsService.save(news);

		} else {// 更新
			old = newsService.get(news.getNewsId());
			news.setUpdateTime(new Date());
			news.setCreatetime(old.getCreatetime());
			// news.setViewCounts(old.getViewCounts()+1);//浏览次数加1
			news.setViewCounts(old.getViewCounts());
			news.setReplyCounts(old.getReplyCounts());

			news.setAuditingStatus(old.getAuditingStatus());
			news.setDepId(old.getDepId());
			
			news.setOrdertop(old.getOrdertop());
			
			newsService.merge(news);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * 审核新闻 add by smart on 20110513
	 */
	public String update() {
		// 获取当前用户
		Authentication auth = SecurityContextHolder.getContext()
				.getAuthentication();
		AppUser user = (AppUser) auth.getPrincipal();
		String userFullName = user.getFullname().toString();

		System.out.println("news.getNewsId():" + news.getNewsId());

		News old = new News();
		old = newsService.get(news.getNewsId());// 因为updatetime和createtime都不允许为空
		//news.setUpdateTime(old.getUpdateTime());
		
		news.setUpdateTime(new Date());
		
		news.setCreatetime(old.getCreatetime());
		news.setStatus(old.getStatus());
		news.setSubjectIcon(old.getSubjectIcon());
		news.setViewCounts(old.getViewCounts());
		news.setReplyCounts(old.getReplyCounts());
		news.setIsDeskImage(old.getIsDeskImage());
		news.setDepId(old.getDepId());
		news.setSubject(old.getSubject());
		news.setAuthor(old.getAuthor());
		news.setContent(old.getContent());
		
		news.setOrdertop(old.getOrdertop());
		
		news.setNewsId(news.getNewsId()); // 需要更新的NewsId
		news.setAuditingPerson(userFullName);
		news.setAuditingCreateDate(new Date());

		if (this.auditingAction.equals("agree")) {
			news.setAuditingStatus(1);// 1代表同意
		} else if (this.auditingAction.equals("disagree")) {
			news.setAuditingStatus(2); // 2代表拒绝
		}else if (this.auditingAction.equals("invalidation")) {
			
			news.setAuditingStatus(old.getAuditingStatus());
			
			news.setStatus(Short.valueOf("0")); // 0代表禁止/失效
		}
		newsService.merge(news);
		setJsonString("{success:true}");
		return Action.SUCCESS;
	}

	/**
	 * 按类型查询新闻
	 */
	public String category() {

		List<News> list = null;
		PagingBean pb = getInitPagingBean();
		if (typeId != null && typeId > 0) {
			list = newsService.findByTypeId(typeId, pb);
		} else {
			list = newsService.getAll(pb);
		}
		Type type = new TypeToken<List<News>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':"
				+ pb.getTotalItems() + ",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 删除新闻图标在新闻表中的记录
	 */
	public String icon() {
		setNews(newsService.get(getNewsId()));
		news.setSubjectIcon("");
		newsService.save(news);
		return SUCCESS;
	}

	/**
	 * 首页新闻查询,该方法按输入的字段模糊查询新闻标题和新闻内容
	 * 
	 * @return
	 */
	public String search() {
		PagingBean pb = getInitPagingBean();
		String searchContent = getRequest().getParameter("searchContent");
		List<News> list = newsService.findBySearch(searchContent, pb);
		Type type = new TypeToken<List<News>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");

		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 获取最新五条新闻在首页显示  edit by smart on 20110520 加入了审核状态栏位的条件
	 */
	public String display() {
		PagingBean pb = new PagingBean(0, 8);
		// 查找发布的前八条新闻
		List<News> list = newsService.findBySearch(null,1, pb);
		getRequest().setAttribute("newsList", list);
		return "display";
	}

	/**
	 * 图片新闻的展示
	 */

	public String image() {
		PagingBean pb = new PagingBean(0, 8);
		// 查找发布的前五条新闻
		List<News> list = newsService.findImageNews(pb);
		List<News> newList = new ArrayList<News>();
		for (News news : list) {
			String content = StringUtil.html2Text(news.getContent());
			if (content.length() > 250) {
				content = content.substring(0, 250);
			}
			news.setContent(content);
			newList.add(news);
		}
		getRequest().setAttribute("imageNewsList", newList);
		return "image";
	}
	
	/**
	 * 新闻置顶功能   该功能主要是把news的setTop字段更新为1,然后把updatetime更新为当前时间
	 * 在门户网站上看新闻的时候的SQL语句需要根据updatetime倒序排和setTop顺序排
	 */
	public String sort(){
		Integer opt = Integer.valueOf(getRequest().getParameter("opt"));
		Long sortId = Long.valueOf(getRequest().getParameter("sortId"));
 		//if(opt==1){//	1:置顶	 0:未置顶 
 			
 			News news = new News();
 			
  			News old = new News();
 			old = newsService.get(sortId);// 因为updatetime和createtime都不允许为空
 			
 			System.out.println("old.getUpdateTime():"+old.getUpdateTime()); 
/*            if(opt==1)
            {
            	news.setUpdateTime(new Date());
            }
            else
            {*/
            	news.setUpdateTime(old.getUpdateTime());
 //           }
            
 			news.setCreatetime(old.getCreatetime());
 			news.setStatus(old.getStatus());
 			news.setSubjectIcon(old.getSubjectIcon());
 			news.setViewCounts(old.getViewCounts());
 			news.setReplyCounts(old.getReplyCounts());
 			news.setIsDeskImage(old.getIsDeskImage());
 			news.setDepId(old.getDepId());
 			news.setSubject(old.getSubject());
 			news.setAuthor(old.getAuthor());
 			news.setContent(old.getContent());
  			
 			news.setNewsId(sortId); // 需要更新的NewsId
 			news.setOrdertop(opt);
 			
 			news.setIssuer(old.getIssuer());
 			news.setTypeId(old.getTypeId());
 			
 			news.setAuditingPerson(old.getAuditingPerson());
 			news.setAuditingCreateDate(old.getAuditingCreateDate());
 			news.setAuditingStatus(old.getAuditingStatus());// 1代表同意
 			newsService.merge(news);
 			setJsonString("{success:true}");
 			
 		//	return Action.SUCCESS;
		//}
 			
		return SUCCESS;
	}
}

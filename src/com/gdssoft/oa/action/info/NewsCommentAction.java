package com.gdssoft.oa.action.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.oa.model.info.News;
import com.gdssoft.oa.model.info.NewsComment;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.info.NewsCommentService;
import com.gdssoft.oa.service.info.NewsService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.google.gson.Gson;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
/**
 * 
 * @author 
 *
 */
public class NewsCommentAction extends BaseAction{
	@Resource
	private NewsCommentService newsCommentService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private NewsService newsService;
	@Resource 
	private SysConfigService sysConfigSerivce;
	private NewsComment newsComment;
	
	private Long commentId;

	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}

	public NewsComment getNewsComment() {
		return newsComment;
	}

	public void setNewsComment(NewsComment newsComment) {
		this.newsComment = newsComment;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		String start = getRequest().getParameter("start");
		String newId = getRequest().getParameter("Q_news.newsId_L_EQ");
		SysConfig commentConfig = sysConfigSerivce.findByKey("commentConfig");
		if(newId !=null && commentConfig.getDataValue().equals(SysConfig.CODE_OPEN)){
			filter.addFilter("Q_status_SN_EQ", "1");
		}
		
		List<NewsComment> list= newsCommentService.getAll(filter);
		
		Gson gson = new Gson();
		SimpleDateFormat simpleDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:[");
		for(NewsComment newsComment : list){
			buff.append("{commentId:'")
				.append(newsComment.getCommentId())
				.append("',subject:").append(gson.toJson(newsComment.getNews().getSubject()))
				.append(",content:")
				.append(gson.toJson(newsComment.getContent()))
				.append(",createtime:'")
				.append(simpleDate.format(newsComment.getCreatetime()))
				.append("',fullname:'")
				.append(newsComment.getFullname())
				.append("',start:'")
				.append(start)
				.append("',status:'")
				.append(newsComment.getStatus())
				.append("'},");
		}
		if(list.size()>0){
			buff.deleteCharAt(buff.length()-1);
		}
		buff.append("]}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				NewsComment delComment = newsCommentService.get(new Long(id));
				News news = delComment.getNews();
				if(news.getReplyCounts()>1){
					news.setReplyCounts(news.getReplyCounts()-1);
				}
				newsService.save(news);
				newsCommentService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		NewsComment newsComment=newsCommentService.get(commentId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(newsComment));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		//被回复的新闻回复次数加1
		News news = newsService.get(newsComment.getNewsId());
		news.setReplyCounts(news.getReplyCounts()+1);
		newsService.save(news);
		
		newsComment.setAppUser(appUserService.get(newsComment.getUserId()));
		newsComment.setCreatetime(new Date());
		newsComment.setNews(news);
		//审核状态为未审核
		newsComment.setStatus(NewsComment.STATUS_NONE);
		
		newsCommentService.save(newsComment);
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 审核通过
	 * @return
	 */
	public String audit(){
		newsComment = newsCommentService.get(commentId);
		newsComment.setStatus(NewsComment.STATUS_PASS);
		
		newsCommentService.save(newsComment);
		setJsonString("{success:true}");
		return SUCCESS;
	}
}

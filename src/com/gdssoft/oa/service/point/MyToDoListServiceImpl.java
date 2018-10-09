package com.gdssoft.oa.service.point;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;
import javax.jws.WebService;

import org.apache.commons.lang.StringUtils;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.XMLOutputter;

import com.gdssoft.core.jbpm.pv.TaskInfo;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.job.DateUtil2;
import com.gdssoft.oa.model.flow.CcuserProcess;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysUserAll;
import com.gdssoft.oa.service.flow.CcuserProcessService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysUserAllService;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */

/**
 * 
 * 待办集成
 * 
 * @author f7400185
 * 
 */
@WebService(endpointInterface = "com.gdssoft.oa.service.point.MyToDoListService", targetNamespace = "http://point.service.oa.gdssoft.com/")
public class MyToDoListServiceImpl implements MyToDoListService {
	//private static Log logger = LogFactory.getLog(MyToDoListServiceImpl.class);
	
	public TaskService taskService;
	public AppUserService appUserService;
	public SysConfigService sysConfigService;
	public CcuserProcessService ccuserProcessService;
	public ProcessRunService processRunService;

//	public SysUserAllService sysUserAllService;
	@Resource
	private SysUserAllService sysUserAllService;
	/*
	@Resource
	public ConferenceService conferenceSerivce;
	@Resource
	public WorkSummaryService workSummaryService;
	@Resource
	public WorkSummarySumService workSummarySumService;
	@Resource
	private NewsService newsService;
	@Resource
	private NoticeService noticeService;
	*/

	public void setAppUserService(AppUserService appUserService) {
		this.appUserService = appUserService;
	}

	public void setTaskService(TaskService taskService) {
		this.taskService = taskService;
	}

	public void setSysConfigService(SysConfigService sysConfigService) {
		this.sysConfigService = sysConfigService;
	}
	//20121115
	public void setCcuserProcessService(CcuserProcessService ccuserProcessService) {
		this.ccuserProcessService = ccuserProcessService;
	}
	
	
	public void setProcessRunService(ProcessRunService processRunService) {
		this.processRunService = processRunService;
	}
	

	/*public SysUserAllService getSysUserAllService() {
		return sysUserAllService;
	}

	public void setSysUserAllService(SysUserAllService sysUserAllService) {
		this.sysUserAllService = sysUserAllService;
	}*/

	@Override
	public String getMyToDoListXML(String empId, String count) {
		 System.out.println("------empId------" + empId);
		 System.out.println("------count------" + count);
		
		try {
			boolean notAll = false;
			String schema = "";
			String responseXml = null;
			Element root = new Element("todolist");
			int icount = 0;
			if (StringUtils.isEmpty(count) || count.equals("0")) {
				icount = 99999;
			} else {
				icount = Integer.valueOf(count);
				notAll = true;
			}
			// 根据用户编号回去用户信息
			AppUser appUser = new AppUser();
			if (empId != null) {
				SysUserAll sysUserAll = sysUserAllService.findByUserName(empId);
				schema = sysUserAll.getSysSchemaConfig().getSchemaCode();
				appUser = appUserService.findByNameAndSchema(schema, empId);
				if(null != appUser) appUser.setOwnerSchema(schema);
			}
			if (appUser == null) {
				return new XMLOutputter().outputString(new Document(root));
			}
			
			String localhostUrl = sysConfigService.findDataValueByTkCkeyWithSchema(
					schema, "linkUrl", "linkUrl").getDataValue();
			/*String localhostUrl = sysConfigService.findDataValueByTkCkey(
					"linkUrl", "linkUrl").getDataValue();*/
			localhostUrl = localhostUrl == null ? "localhost" : localhostUrl;
			
			// 获取所有的待办事项
			List<TaskInfo> taskInfos = getTaskList(appUser);
			System.out.println("------size------" + taskInfos.size());
			
			if (taskInfos != null) {
				root.setAttribute("totlecount", String.valueOf(taskInfos.size()));
				root.setAttribute(
					"resultcount", 
					String.valueOf(
						notAll?(icount-taskInfos.size()>=0?taskInfos.size():icount):taskInfos.size()
					)
				);
				/*
				List<TaskInfo> taskInfos = list.getTaskInfos();
				List<Conference> conferences = list.getConferences();
				List<News> newInfos = list.getNewInfos();
				List<Notice> notices = list.getNotices();
				List<WorkSummary> workSummaries = list.getWorkSummaries();
				List<WorkSummarySum> workSummarySums = list.getWsSummarySums();
				*/
				int taskInfoNum = 0;
				if (taskInfos != null && taskInfos.size() > 0) {
					taskInfoNum = taskInfos.size();
					// 显示待办流程
					for (int i = 0; i < taskInfoNum; i++) {
						if (notAll) {
							if (i >= icount) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						TaskInfo taskInfo = taskInfos.get(i);
						Element element = new Element("todo");
						setElementAttribute(element, "title", taskInfo.getTaskName());
						setElementAttribute(element, "date", DateUtil2.DateToString(taskInfo.getCreateTime(),"yyyy-MM-dd HH:mm:ss"));
						String doLink = taskInfo.getLink();
						if (null == doLink || doLink.equals("")) {
							doLink = localhostUrl + "/index.jsp?viewId=MyTaskView";
						} else {
							doLink = localhostUrl + "/index.jsp?viewId=" + doLink;
						}
						
						setElementAttribute(element, "link", doLink);// 暂时用本地的地址测试
						root.addContent(element);
					}
				}
				/*
				int conferencesNum = 0;
				if (conferences != null && conferences.size() > 0) {
					conferencesNum = conferences.size();
					// 显示会议流程
					for (int i = 0; i < conferencesNum; i++) {
						if (notAll) {
							if (i >= icount - taskInfoNum) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						Element element = new Element("todo");

						// TODO 实现会议流程

						Conference conf1 = conferences.get(i);

						setElementAttribute(element, "title", conf1
								.getCreateBy()
								+ "同志的的会议申请待审批");
						setElementAttribute(element, "date", DateUtil2
								.DateToString(conf1.getCreateDate(),
										"yyyy-MM-dd HH:mm:ss"));
						
						//setElementAttribute(element, "link",
						//"http://web.szmtr.com.cn/sz_matro3_oa/admin/getConference.do?confId="
						//+ conf1.getConfId());
						 

						setElementAttribute(element, "link", localhostUrl
								+ "/index.jsp?viewId=ZanCunConferenceView");

						root.addContent(element);
					}
				}
				int newInfosNum = 0;
				if (newInfos != null && newInfos.size() > 0) {
					newInfosNum = newInfos.size();
					// 显示新闻流程
					for (int i = 0; i < newInfos.size(); i++) {
						if (notAll) {
							if (i >= icount - taskInfoNum - conferencesNum) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						Element element = new Element("todo");

						// TODO 实现新闻流程
						News news = newInfos.get(i);

						setElementAttribute(element, "title", news.getIssuer()

						+ "同志的的新闻申请待审批");
						setElementAttribute(element, "date", news
								.getCreatetime() == null ? "" : DateUtil2
								.DateToString(news.getCreatetime(),
										"yyyy-MM-dd HH:mm:ss"));
						
						long newsTypeId = news.getTypeId().longValue();
						String viewId = "NewsView";
						if (newsTypeId == 1){
							viewId = "NewsAuditingView_1";
						} else if(newsTypeId == 3) {
							viewId = "NewsAuditingView_2";
						} else if(newsTypeId == 22) {
							viewId = "NewsAuditingView_3";
						} else if(newsTypeId == 4) {
							viewId = "NewsAuditingView_4";
						} else if(newsTypeId == 6) {
							viewId = "NewsAuditingView_5";
						} else if(newsTypeId == 25) {
							viewId = "NewsAuditingView_6";
						} else if(newsTypeId == 26) {
							viewId = "NewsAuditingView_7";
						} else if(newsTypeId == 27) {
							viewId = "NewsAuditingView_8";
						} else if(newsTypeId == 28) {
							viewId = "NewsAuditingView_9";
						} else if(newsTypeId == 31) {
							viewId = "NewsAuditingView_10";
						} else if(newsTypeId == 29) {
							viewId = "NewsAuditingView_11";
						} else if(newsTypeId == 30) {
							viewId = "NewsAuditingView_12";
						}
						setElementAttribute(element, "link", localhostUrl
								+ "/index.jsp?viewId=" + viewId);
						root.addContent(element);
					}
				}
				int noticesNum = 0;
				if (notices != null && notices.size() > 0) {
					noticesNum = notices.size();
					// 显示通知流程
					for (int i = 0; i < noticesNum; i++) {
						if (notAll) {
							if (i >= icount - taskInfoNum - conferencesNum
									- newInfosNum) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						Element element = new Element("todo");

						// TODO 实现通知流程
						Notice notice = notices.get(i);
						setElementAttribute(element, "title", notice
								.getPostName()
								+ "同志的的公告申请待审批");
						setElementAttribute(element, "date", notice
								.getCreatetime() == null ? "" : DateUtil2
								.DateToString(notice.getCreatetime(),
										"yyyy-MM-dd HH:mm:ss"));
						
						String viewId = "NoticeView";
						switch (notice.getType().intValue()) {
						case 1:
							viewId = "NoticeAuditingView_1";
							break;
						case 2:
							viewId = "NoticeAuditingView_2";
							break;
						case 3:
							viewId = "NoticeAuditingView_3";
							break;
						default:
							break;
						}
						setElementAttribute(element, "link", localhostUrl
								+ "/index.jsp?viewId=" + viewId);

						root.addContent(element);
					}
				}
				int workSummariesNum = 0;
				if (workSummaries != null && workSummaries.size() > 0) {
					// 工作总结流程
					workSummariesNum = workSummaries.size();
					if (workSummaries.size() > 0) {
						for (int i = 0; i < workSummariesNum; i++) {
							if (notAll) {
								if (i >= icount - taskInfoNum - conferencesNum
										- newInfosNum - noticesNum) {
									notAll = false;
									responseXml = new XMLOutputter()
											.outputString(new Document(root));
									System.out.println("------responseXml----"
											+ responseXml);
									return responseXml;
								}
							}
							WorkSummary todo = workSummaries.get(i);
							Element element = new Element("todo");
							setElementAttribute(element, "title", todo
									.getTitle()
									+ "待审核");
							setElementAttribute(element, "date", DateUtil2
									.DateToString(todo.getLastedittime(),
											"yyyy-MM-dd HH:mm:ss"));
							setElementAttribute(element, "link",
									localhostUrl+"/index.jsp?ViewId=WorkSummaryAuthView");
							root.addContent(element);
						}
					}
				}

				if (workSummarySums != null && workSummarySums.size() > 0) {
					// 工作总结汇总
					if (workSummarySums.size() > 0) {
						for (int i = 0; i < workSummarySums.size(); i++) {
							if (notAll) {
								if (i >= icount - taskInfoNum - conferencesNum
										- newInfosNum - noticesNum
										- workSummariesNum) {
									notAll = false;
									responseXml = new XMLOutputter()
											.outputString(new Document(root));
									System.out.println("------responseXml----"
											+ responseXml);
									return responseXml;
								}
							}
							WorkSummarySum todo = workSummarySums.get(i);
							Element element = new Element("todo");
							setElementAttribute(element, "title", todo
									.getTitle()
									+ "待审核");
							setElementAttribute(element, "date", DateUtil2
									.DateToString(todo.getLasteditDate(),
											"yyyy-MM-dd HH:mm:ss"));
							setElementAttribute(element, "link",
									localhostUrl+"/index.jsp?ViewId=WorkSummarySumAuthView");
							root.addContent(element);
						}
					}
				}
				*/
			}

			responseXml = new XMLOutputter().outputString(new Document(root));
			System.out.println("------responseXml----" + responseXml);
			return responseXml;

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return null;
	}
/*
	@Override
	public String getDoListXML(String empId, String count) {
		// System.out.println("------empId------" + empId);
		// System.out.println("------count------" + count);
		try {
			boolean notAll = false;
			String responseXml = null;
			Element root = new Element("todolist");
			int icount = 0;
			if (StringUtils.isEmpty(count) || count.equals("0")) {
				icount = 99999;
			} else {
				icount = Integer.valueOf(count);
				notAll = true;
			}
			// 根据用户编号回去用户信息
			AppUser appUser = new AppUser();
			if (empId != null) {
				appUser = appUserService.findByUserName(empId);
			}
			if (appUser == null) {
				return new XMLOutputter().outputString(new Document(root));
			}

			String localhostUrl = sysConfigService.findDataValueByTkCkey(
					"linkUrl", "linkUrl").getDataValue();
			localhostUrl = localhostUrl == null ? "localhost" : localhostUrl;
			
			// 获取所有的待办事项
			List<TaskInfo> taskInfos = getTaskList(appUser);
			
			if (taskInfos != null) {
				root.setAttribute("totlecount", String.valueOf(taskInfos.size()));
				root.setAttribute("resultcount", String
						.valueOf(notAll ? (icount - taskInfos.size() >= 0 ? taskInfos.size() : icount) : taskInfos.size()));
				
				// List<TaskInfo> taskInfos = list.getTaskInfos();
				List<Conference> conferences = list.getConferences();
				List<News> newInfos = list.getNewInfos();
				List<Notice> notices = list.getNotices();
				List<WorkSummary> workSummaries = list.getWorkSummaries();
				List<WorkSummarySum> workSummarySums = list.getWsSummarySums();

				int taskInfoNum = 0;

				int conferencesNum = 0;
				if (conferences != null && conferences.size() > 0) {
					conferencesNum = conferences.size();
					// 显示会议流程
					for (int i = 0; i < conferencesNum; i++) {
						if (notAll) {
							if (i >= icount - taskInfoNum) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						Element element = new Element("todo");

						// TODO 实现会议流程

						Conference conf1 = conferences.get(i);

						setElementAttribute(element, "title", conf1
								.getCreateBy()
								+ "同志的的会议申请待审批");
						setElementAttribute(element, "date", DateUtil2
								.DateToString(conf1.getCreateDate(),
										"yyyy-MM-dd HH:mm:ss"));
						
						// setElementAttribute(element, "link",
						// "http://web.szmtr.com.cn/sz_matro3_oa/admin/getConference.do?confId="
						// + conf1.getConfId());

						setElementAttribute(element, "link", localhostUrl
								+ "/index.jsp?viewId=ZanCunConferenceView");

						root.addContent(element);
					}
				}
				int newInfosNum = 0;
				if (newInfos != null && newInfos.size() > 0) {
					newInfosNum = newInfos.size();
					// 显示新闻流程
					for (int i = 0; i < newInfos.size(); i++) {
						if (notAll) {
							if (i >= icount - taskInfoNum - conferencesNum) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						Element element = new Element("todo");

						// TODO 实现新闻流程
						News news = newInfos.get(i);

						setElementAttribute(element, "title", news.getIssuer()

						+ "同志的的新闻申请待审批");
						setElementAttribute(element, "date", news
								.getCreatetime() == null ? "" : DateUtil2
								.DateToString(news.getCreatetime(),
										"yyyy-MM-dd HH:mm:ss"));

						setElementAttribute(element, "link", localhostUrl
								+ "/index.jsp?viewId=NewsView");

						root.addContent(element);
					}
				}
				int noticesNum = 0;
				if (notices != null && notices.size() > 0) {
					noticesNum = notices.size();
					// 显示通知流程
					for (int i = 0; i < noticesNum; i++) {
						if (notAll) {
							if (i >= icount - taskInfoNum - conferencesNum
									- newInfosNum) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						Element element = new Element("todo");

						// TODO 实现通知流程
						Notice notice = notices.get(i);
						setElementAttribute(element, "title", notice
								.getPostName()
								+ "同志的的公告申请待审批");
						setElementAttribute(element, "date", notice
								.getCreatetime() == null ? "" : DateUtil2
								.DateToString(notice.getCreatetime(),
										"yyyy-MM-dd HH:mm:ss"));
						setElementAttribute(element, "link", localhostUrl
								+ "/index.jsp?viewId=NoticeView");

						root.addContent(element);
					}
				}
				int workSummariesNum = 0;
				if (workSummaries != null && workSummaries.size() > 0) {
					// 工作总结流程
					workSummariesNum = workSummaries.size();
					if (workSummaries.size() > 0) {
						for (int i = 0; i < workSummariesNum; i++) {
							if (notAll) {
								if (i >= icount - taskInfoNum - conferencesNum
										- newInfosNum - noticesNum) {
									notAll = false;
									responseXml = new XMLOutputter()
											.outputString(new Document(root));
									System.out.println("------responseXml----"
											+ responseXml);
									return responseXml;
								}
							}
							WorkSummary todo = workSummaries.get(i);
							Element element = new Element("todo");
							setElementAttribute(element, "title", todo
									.getTitle()
									+ "待审核");
							setElementAttribute(element, "date", DateUtil2
									.DateToString(todo.getLastedittime(),
											"yyyy-MM-dd HH:mm:ss"));
							setElementAttribute(element, "link",
									localhostUrl+"/index.jsp?ViewId=WorkSummaryAuthView");
							root.addContent(element);
						}
					}
				}

				if (workSummarySums != null && workSummarySums.size() > 0) {
					// 工作总结汇总
					if (workSummarySums.size() > 0) {
						for (int i = 0; i < workSummarySums.size(); i++) {
							if (notAll) {
								if (i >= icount - taskInfoNum - conferencesNum
										- newInfosNum - noticesNum
										- workSummariesNum) {
									notAll = false;
									responseXml = new XMLOutputter()
											.outputString(new Document(root));
									System.out.println("------responseXml----"
											+ responseXml);
									return responseXml;
								}
							}
							WorkSummarySum todo = workSummarySums.get(i);
							Element element = new Element("todo");
							setElementAttribute(element, "title", todo
									.getTitle()
									+ "待审核");
							setElementAttribute(element, "date", DateUtil2
									.DateToString(todo.getLasteditDate(),
											"yyyy-MM-dd HH:mm:ss"));
							setElementAttribute(element, "link",
									localhostUrl+"/index.jsp?ViewId=WorkSummarySumAuthView");
							root.addContent(element);
						}
					}
				}
			}

			responseXml = new XMLOutputter().outputString(new Document(root));
			System.out.println("------responseXml----" + responseXml);
			return responseXml;

		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
		return null;
	}
*/
	private void setElementAttribute(Element element, String name, String value) {
		if (value == null) {
			value = "";
		}
		element.setAttribute(name, value);
	}

	/*
	private DoList getDoList(AppUser appUser) {
		DoList doList = new DoList();
		List<TaskInfo> taskInfos = getTaskList(appUser);
		List<Conference> conferences = getConferences(appUser);
		List<News> newInfos = getNewInfos(appUser);
		List<Notice> notices = getNotices(appUser);
		List<WorkSummary> workSummaries = getWorkSummarys(appUser);
		List<WorkSummarySum> workSummarySums = getWorkSummarySums(appUser);
		// TODO 这里添加其他待办事项
		doList.setTaskInfos(taskInfos);
		doList.setConferences(conferences);
		doList.setNewInfos(newInfos);
		doList.setNotices(notices);
		doList.setWorkSummaries(workSummaries);
		doList.setWsSummarySums(workSummarySums);
		int total = 0;
		if (taskInfos != null) {
			total += taskInfos.size();
		}
		if (conferences != null) {
			total += conferences.size();
		}
		if (newInfos != null) {
			total += newInfos.size();
		}
		if (notices != null) {
			total += notices.size();
		}
		if (workSummaries != null) {
			total += workSummaries.size();
		}
		if (workSummarySums != null) {
			total += workSummarySums.size();
		}
		doList.setTotal(total);
		return doList;
	}

	private DoList getToDoList(AppUser appUser) {
		DoList doList = new DoList();
		List<Conference> conferences = getConferences(appUser);
		List<News> newInfos = getNewInfos(appUser);
		List<Notice> notices = getNotices(appUser);
		List<WorkSummary> workSummaries = getWorkSummarys(appUser);
		List<WorkSummarySum> workSummarySums = getWorkSummarySums(appUser);
		// TODO 这里添加其他待办事项
		doList.setConferences(conferences);
		doList.setNewInfos(newInfos);
		doList.setNotices(notices);
		doList.setWorkSummaries(workSummaries);
		doList.setWsSummarySums(workSummarySums);
		int total = 0;

		if (conferences != null) {
			total += conferences.size();
		}
		if (newInfos != null) {
			total += newInfos.size();
		}
		if (notices != null) {
			total += notices.size();
		}
		if (workSummaries != null) {
			total += workSummaries.size();
		}
		if (workSummarySums != null) {
			total += workSummarySums.size();
		}
		doList.setTotal(total);
		return doList;
	}
	*/
	/**
	 * 
	 * 获取流程待办事项
	 * 
	 * @param empId
	 * @param count
	 * @return
	 */
	private List<TaskInfo> getTaskList(AppUser appUser) {
		List<TaskInfo> list = new ArrayList<TaskInfo>();

		PagingBean pb = new PagingBean(0, 99999);

		if (appUser != null) {
			/*
			list = taskService.getTaskInfosByUserId(String.valueOf(appUser
					.getUserId()), pb);
			*/
			
			/*list = taskService.getTasksByUserIdFromView(
					String.valueOf(appUser.getUserId()), 
					pb, 
					"date_desc",
					"urgent_asc");*/
			list = taskService.getTasksByUserFromView(
					appUser, 
					pb, 
					"date_desc",
					"urgent_asc");

		}
		return list;
	}

	@Override
	public String getMyCCListXML(String empId, String count) {
		System.out.println("------empId------" + empId);
		 System.out.println("------count------" + count);
		
		try {
			boolean notAll = false;
			String responseXml = null;
			Element root = new Element("cclist");
			int icount = 0;
			if (StringUtils.isEmpty(count) || count.equals("0")) {
				icount = 99999;
			} else {
				icount = Integer.valueOf(count);
				notAll = true;
			}
			// 根据用户编号回去用户信息
			AppUser appUser = new AppUser();
			if (empId != null) {
				appUser = appUserService.findByUserName(empId);
			}else{
				appUser = new AppUser();
				appUser.setUserId(Long.parseLong(empId));
			}
			if (appUser == null) {
				return new XMLOutputter().outputString(new Document(root));
			}
			
			String localhostUrl = sysConfigService.findDataValueByTkCkey(
					"linkUrl", "linkUrl").getDataValue();
			localhostUrl = localhostUrl == null ? "localhost" : localhostUrl;

			List<CcuserProcess> ccList = ccuserProcessService.getMyNewCCList(appUser);
			
			System.out.println("------size------" + ccList.size());
			
			if (ccList != null) {
				root.setAttribute("totlecount", String.valueOf(ccList.size()));
				root.setAttribute(
					"resultcount", 
					String.valueOf(
						notAll?(icount-ccList.size()>=0?ccList.size():icount):ccList.size()
					)
				);
				int taskInfoNum = 0;
				if (ccList != null && ccList.size() > 0) {
					taskInfoNum = ccList.size();
					// 显示待办流程
					for (int i = 0; i < taskInfoNum; i++) {
						if (notAll) {
							if (i >= icount) {
								notAll = false;
								responseXml = new XMLOutputter()
										.outputString(new Document(root));
								System.out.println("------responseXml----"
										+ responseXml);
								return responseXml;
							}
						}
						CcuserProcess ccuserProcess = ccList.get(i);
						ProcessRun processRun =processRunService.get(ccuserProcess.getProcessRunId());
						String subject=processRun.getSubject();
						String flowName=processRun.getProDefinition().getName();
						Element element = new Element("cc");
						//setElementAttribute(element, "flowName", flowName);
						setElementAttribute(element, "title", flowName+"--"+subject+"("+processRun.getCreator()+")");//修改发送者
						//setElementAttribute(element, "creator", ccuserProcess.getAppUser().getFullname());
						setElementAttribute(element, "date", DateUtil2.DateToString(ccuserProcess.getCreateDate(),"yyyy-MM-dd HH:mm:ss"));
						
						String doLink = localhostUrl + "/index.jsp?viewId=ProcessCCReportView";
						
						setElementAttribute(element, "link", doLink);
						root.addContent(element);
					}
				}
			}

			responseXml = new XMLOutputter().outputString(new Document(root));
			System.out.println("------responseXml----" + responseXml);
			return responseXml;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 
	 * 会议待办
	 * 
	 * @param empId
	 * @param count
	 * @return
	 */ /*
	public List<Conference> getConferences(AppUser appUser) {

		List<Conference> confList = conferenceSerivce.getDaibanConf(appUser
				.getUsername());
		return confList;
	}
*/
	/**
	 * 
	 * 
	 * 新闻待办
	 * 
	 * @param empId
	 * @param count
	 * @return
	 */ /*
	public List<News> getNewInfos(AppUser appUser) {

		// TODO

		PagingBean pb = new PagingBean(0, 99999);
		List<News> list = newsService.getDaibanNews(appUser, pb);
		return list;
	}
*/
	/**
	 * 
	 * 通知待办
	 * 
	 * @param empId
	 * @param count
	 * @return
	 */ /*
	public List<Notice> getNotices(AppUser appUser) {

		// TODO
		PagingBean pb = new PagingBean(0, 99999);
		List<Notice> list = noticeService.getDaibanNotice(appUser, pb);
		return list;
	}
*/
	/**
	 * 
	 * 工作总结
	 * 
	 * @param empId
	 * @param count
	 * @return
	 *//*
	public List<WorkSummary> getWorkSummarys(AppUser appUser) {

		// TODO
		PagingBean pb = new PagingBean(0, 99999);
		List<WorkSummary> list = workSummaryService.getbyauth(appUser, pb);
		return list;
	}
*/
	/**
	 * 
	 * 工作总结汇总
	 * 
	 * @param empId
	 * @param count
	 * @return
	 */ /*
	public List<WorkSummarySum> getWorkSummarySums(AppUser appUser) {

		// TODO
		PagingBean pb = new PagingBean(0, 99999);
		List<WorkSummarySum> list = workSummarySumService
				.getbyauth(appUser, pb);
		return list;
	}
*/
}

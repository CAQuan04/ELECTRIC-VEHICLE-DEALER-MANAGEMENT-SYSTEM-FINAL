namespace EVDealer.BE.DAL.Utils;

public class Pagination
{
    public int Page { get; set; } = 1;
    public int Size { get; set; } = 10;
    public int Total { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)Total / Size);
}

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    public Pagination Pagination { get; set; } = new();
}